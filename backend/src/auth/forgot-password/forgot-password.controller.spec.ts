import { Test, TestingModule } from "@nestjs/testing";
import { ForgotPasswordController } from "./forgot-password.controller";
import { ForgotPasswordService } from "./forgot-password.service";
import { CheckMailDto } from "../../dto/check-mail.dto";
import { NewPasswordDto } from "../../dto/newPassword.dto";

describe('ForgotPasswordController', () => {
    let forgotPasswordController: ForgotPasswordController
    let forgotPasswordService: ForgotPasswordService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ForgotPasswordController],
            providers: [
                {
                    provide: ForgotPasswordService,
                    useValue: {
                        sendMailPassword: jest.fn(),
                        changePassword: jest.fn()
                    }
                }
            ]
        }).compile()

        forgotPasswordController = module.get<ForgotPasswordController>(ForgotPasswordController)
        forgotPasswordService = module.get<ForgotPasswordService>(ForgotPasswordService)
    })
    describe('test the forgot password controller', () => {
        it('should call the service and send the mail', async () => {
            const checkMailDto = new CheckMailDto()
            Object.assign(checkMailDto, {
                mail: 'johndoe@test.com'
            })

            await forgotPasswordController.sendMailPassword(checkMailDto)

            expect(forgotPasswordService.sendMailPassword).toHaveBeenCalledWith(checkMailDto)
        })

        it('should call the service and change the password in database', async () => {
            const mockToken = 'mocked-token'

            const newPasswordDto = new NewPasswordDto()
            Object.assign(newPasswordDto, {
                newPassword: 'P@ssword123',
                confirmPassword: 'P@ssword123'
            })

            await forgotPasswordController.changePassword(mockToken, newPasswordDto)

            expect(forgotPasswordService.changePassword).toHaveBeenCalledWith(mockToken, newPasswordDto)
        })
    })
})