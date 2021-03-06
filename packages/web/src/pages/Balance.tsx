import React, { FC } from "react"
import { RouteComponentProps, Link } from "@reach/router"
import { round } from "@noquarter/utils"
import { styled } from "@noquarter/ui"
import { media } from "../application/theme"
import useAppContext from "../lib/hooks/useAppState"
import IconPlus from "../assets/images/icon-plus.svg"

import Page from "../components/Page"
import GroupBalance from "../components/GroupBalance"
import GroupName from "../components/GroupName"
import InviteForm from "../components/InviteForm"
import Display from "../components/styled/Display"
import { getCurrency } from "../lib/helpers"

const Balance: FC<RouteComponentProps> = () => {
  const { user, group } = useAppContext()
  if (!group) return null
  const getBalanceHeader = () => {
    if (user.balance > 0) {
      return `You are owed ${getCurrency(group && group.currency)}${round(
        user.balance * 0.01,
      )}`
    } else {
      return `You owe ${getCurrency(group && group.currency)}${Math.abs(
        round(user.balance * 0.01),
      )}`
    }
  }
  return (
    <Page>
      {group.invites.length === 0 && group.users.length === 1 ? (
        <InviteForm group={group} />
      ) : (
        <StyledWrapper>
          <StyledHeader>
            <StyledName>
              <GroupName group={group} />
              <p>{getBalanceHeader()}</p>
            </StyledName>
            <Display size="md">
              <Link to="/new-cost">
                <StyledAdd src={IconPlus} alt="add" height={60} />
              </Link>
            </Display>
          </StyledHeader>
          <GroupBalance users={group.users} />
          <Display size="md" hide={true}>
            <StyledButtonWrapper>
              <Link to="/new-cost">
                <StyledAdd src={IconPlus} alt="add" height={60} />
              </Link>
            </StyledButtonWrapper>
          </Display>
        </StyledWrapper>
      )}
    </Page>
  )
}

export default Balance

const StyledWrapper = styled.div`
  padding: ${p => p.theme.paddingL};

  ${media.greaterThan("sm")`
    padding: 0;
  `}
`

const StyledHeader = styled.div`
  ${p => p.theme.flexBetween};
  padding: 0 0 0 60px;

  ${media.greaterThan("sm")`
    padding: 0 60px;
  `}
`

const StyledName = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${p => p.theme.paddingS};

  p {
    padding-left: ${p => p.theme.paddingS};
    font-size: ${p => p.theme.textM};
    color: ${p => p.theme.colorLabel};
  }

  ${p => media.greaterThan("sm")`
    padding: ${p.theme.paddingXL};
  `}
`
const StyledButtonWrapper = styled.div`
  width: 100%;
  ${p => p.theme.flexCenter};
`

const StyledAdd = styled.img`
  border-radius: 50%;
`
