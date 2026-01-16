import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const { nome, email, password } = data

    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      return response.conflict({ message: 'Este email já está em uso' })
    }

    const user = await User.create({
      name: nome,
      email,
      password,
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      user: {
        id: user.id.toString(),
        nome: user.name,
        email: user.email,
      },
      token: token.value!.release(),
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      user: {
        id: user.id.toString(),
        nome: user.name,
        email: user.email,
      },
      token: token.value!.release(),
    })
  }

  async me({ auth, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    return response.ok({
      id: user.id.toString(),
      nome: user.name,
      email: user.email,
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()
    const token = auth.user!.currentAccessToken.identifier

    await User.accessTokens.delete(user, token)

    return response.ok({ message: 'Logout realizado com sucesso' })
  }
}
