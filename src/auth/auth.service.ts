import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Role } from '../user/entities/role.enum';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
    private readonly SALT_ROUNDS = 12;
    private readonly REFRESH_TOKEN_EXPIRY_DAYS = 7;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(RefreshToken)
        private readonly refreshTokenRepository: Repository<RefreshToken>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(dto: RegisterDto): Promise<AuthResponseDto> {
        const existing = await this.userRepository.findOne({
            where: { email: dto.email.toLowerCase() },
        });

        if (existing) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

        // First user registered becomes SUPER_ADMIN
        const userCount = await this.userRepository.count();
        const role = userCount === 0 ? Role.SUPER_ADMIN : Role.VIEWER;

        const user = this.userRepository.create({
            email: dto.email.toLowerCase(),
            passwordHash,
            fullName: dto.fullName,
            role,
        });

        const savedUser = await this.userRepository.save(user);
        return this.generateTokens(savedUser);
    }

    async login(dto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.userRepository.findOne({
            where: { email: dto.email.toLowerCase() },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user);
    }

    async refresh(refreshToken: string): Promise<AuthResponseDto> {
        const tokenHash = await bcrypt.hash(refreshToken, this.SALT_ROUNDS);

        // Find all non-revoked, non-expired tokens for validation
        const storedTokens = await this.refreshTokenRepository.find({
            where: { isRevoked: false },
            relations: ['user'],
        });

        let validToken: RefreshToken | null = null;
        for (const stored of storedTokens) {
            const isMatch = await bcrypt.compare(refreshToken, stored.tokenHash);
            if (isMatch && stored.expiresAt > new Date()) {
                validToken = stored;
                break;
            }
        }

        if (!validToken) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        if (!validToken.user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Rotate: revoke old, issue new
        validToken.isRevoked = true;
        await this.refreshTokenRepository.save(validToken);

        return this.generateTokens(validToken.user);
    }

    async logout(userId: string): Promise<void> {
        await this.refreshTokenRepository.update(
            { userId, isRevoked: false },
            { isRevoked: true },
        );
    }

    async getProfile(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    private async generateTokens(user: User): Promise<AuthResponseDto> {
        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign({ ...payload }, {
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m') as any,
        });

        const refreshTokenValue = this.jwtService.sign(
            { sub: user.id, type: 'refresh' } as Record<string, unknown>,
            { expiresIn: `${this.REFRESH_TOKEN_EXPIRY_DAYS}d` as any },
        );

        const refreshTokenHash = await bcrypt.hash(refreshTokenValue, this.SALT_ROUNDS);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRY_DAYS);

        const refreshTokenEntity = this.refreshTokenRepository.create({
            tokenHash: refreshTokenHash,
            userId: user.id,
            expiresAt,
        });
        await this.refreshTokenRepository.save(refreshTokenEntity);

        return {
            accessToken,
            refreshToken: refreshTokenValue,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
}
