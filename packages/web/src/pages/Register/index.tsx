import React, { memo, useState, FC } from "react"
import { RouteComponentProps, Link, navigate } from "@reach/router"
import { GraphQLError } from "graphql"

import { useRegister, useCheckHouse } from "@split/connector"

import styled from "../../application/theme"
import { getQueryString } from "../../lib/helpers"

import Input from "../../components/Input"
import Button from "../../components/Button"
import AuthForm from "../../components/AuthForm"

const Register: FC<RouteComponentProps> = () => {
  const inviteHouseId = getQueryString("invite")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")

  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const { house, checkHouseError } = useCheckHouse(inviteHouseId)
  const register = useRegister()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setLoading(true)
    register({
      variables: {
        data: { email, password, firstName, lastName, inviteHouseId },
      },
    })
      .then(() => navigate("/"))
      .catch((registerError: GraphQLError) => {
        setLoading(false)
        setError(registerError.message.split(":")[1])
      })
  }

  return (
    <AuthForm handleSubmit={handleSubmit}>
      {house ? (
        <StyledInviteHeader>
          You are being invited to join <br />
          <span>{house.name}</span>
        </StyledInviteHeader>
      ) : (
        checkHouseError && (
          <StyledInviteHeader>Invalid invite code</StyledInviteHeader>
        )
      )}
      <Input
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        required={true}
        placeholder="jim@gmail.com"
      />
      <br />
      <Input
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        required={true}
        placeholder="********"
      />
      <Input
        label="First name"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        type="text"
        required={true}
        placeholder="Jim"
      />
      <br />

      <Input
        label="Last name"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        type="text"
        required={true}
        placeholder="Sebe"
      />
      <br />
      <Button disabled={loading} loading={loading} full={true}>
        Sign up
      </Button>
      {error && <StyledError>{error}</StyledError>}
      <Link to="/login">
        <StyledLink>Login</StyledLink>
      </Link>
    </AuthForm>
  )
}

export default memo(Register)

const StyledInviteHeader = styled.h2`
  width: 100%;
  text-align: center;
  font-weight: normal;
  margin-bottom: ${p => p.theme.paddingXL};

  span {
    font-weight: ${p => p.theme.fontBlack};
  }
`

const StyledLink = styled.div`
  text-align: right;
  width: 100%;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  color: ${p => p.theme.colorHeader};
  padding: ${p => p.theme.paddingS};
  font-size: ${p => p.theme.textM};

  &:hover {
    opacity: 0.8;
  }
  &:focus {
    text-decoration: underline;
  }
`
const StyledError = styled.div`
  opacity: 0.4;
  width: 100%;
  text-align: right;
  padding: ${p => p.theme.paddingM};
  font-size: ${p => p.theme.textS};
`
