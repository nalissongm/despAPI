import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { CompleteProfileDto } from '../dtos/complete-profile.dto';
import { IUserRepository } from '../../auth/repositories/iuser.repository';
import { IHashProvider } from '../../../shared/containers/hash/ihash.provider';
import { UserModel } from '../../auth/infra/models/user.model';

@Injectable()
export class CompleteProfileUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashProvider)
    private readonly hashProvider: IHashProvider,
  ) {}

  /**
   * Finaliza o onboarding do aluno atualizando dados demográficos e forçando a troca de senha.
   * 
   * @param userId ID do usuário extraído do JWT
   * @param data DTO com CPF, Data de Nascimento, Avatar e Nova Senha
   */
  async execute(userId: string, data: CompleteProfileDto): Promise<UserModel> {
    // 1. Localiza o usuário no banco
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Valida o estado do onboarding
    if (user.onboardingStep !== 'PENDING_PROFILE') {
      if (user.onboardingStep === 'COMPLETED') {
        throw new BadRequestException('Profile registration is already completed');
      }
      throw new BadRequestException('User onboarding step is invalid for this operation');
    }

    // 3. Hash da nova senha
    user.passwordHash = await this.hashProvider.generateHash(data.password);

    // 4. Atribuição de dados demográficos
    user.cpf = data.cpf;
    user.dateOfBirth = new Date(data.dateOfBirth);
    
    if (data.avatarUrl) {
      user.avatarUrl = data.avatarUrl;
    }
    
    // 5. Transição de estado
    user.onboardingStep = 'COMPLETED';
    
    // 6. Persistência
    const savedUser = await this.userRepository.save(user);

    // 7. Sanitização do retorno
    const userResponse = savedUser.toJSON() as UserModel;
    delete userResponse.passwordHash;

    return userResponse;
  }
}
