import { Resolver, Query, Ctx, Mutation, Arg, Authorized } from "type-graphql"

import { ResolverContext } from "../../lib/types"
import { createToken, decryptToken } from "../../lib/jwt"

import { User } from "./user.entity"
import { UserService } from "./user.service"
import { UserMailer } from "./user.mailer"

import { RegisterInput } from "./inputs/register.input"
import { LoginInput } from "./inputs/login.input"
import { UpdateInput } from "./inputs/update.input"
import { ResetPasswordInput } from "./inputs/resetPassword.input"
import { UserRepository } from "./user.repository"
import { CurrentUser } from "../shared/middleware/currentUser"
import { SlackService } from "../shared/slack.service"

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly userMailer: UserMailer,
    private readonly slackService: SlackService,
  ) {}

  // ME
  @Authorized()
  @Query(() => User, { nullable: true })
  me(@CurrentUser() currentUser: User): Promise<User> {
    return this.userRepository.findById(currentUser.id)
  }

  // REGISTER
  @Mutation(() => User)
  async register(
    @Arg("data") data: RegisterInput,
    @Ctx() { req }: ResolverContext,
  ): Promise<User> {
    const user = await this.userService.create(data)
    if (req.session) req.session.user = user
    this.userMailer.sendWelcomeEmail(user)
    this.slackService.sendChatMessage(
      `${user.firstName} ${user.lastName} signed up!`,
    )
    return user
  }

  // LOGIN
  @Mutation(() => User)
  async login(
    @Arg("data") data: LoginInput,
    @Ctx() { req }: ResolverContext,
  ): Promise<User> {
    const user = await this.userService.login(data)
    if (req.session) req.session.user = user
    return user
  }

  // UPDATE USER
  @Authorized()
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("data") data: UpdateInput,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    return this.userService.update(currentUser.id, data)
  }

  // LOGOUT
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: ResolverContext): Promise<boolean> {
    await new Promise(res => {
      if (req.session) req.session.destroy(() => res())
    })
    res.clearCookie("split.cookie")
    return true
  }

  // FORGOT PASSWORD
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new Error("User not found")
    const token = await createToken(user.id)
    this.userMailer.sendResetPasswordLink(user, token)
    return true
  }

  // RESET PASSWORD
  @Mutation(() => Boolean)
  async resetPassword(@Arg("data")
  {
    token,
    password,
  }: ResetPasswordInput): Promise<boolean> {
    const payload: { id: string } = await decryptToken(token)
    await this.userService.update(payload.id, { password })
    return true
  }
}
