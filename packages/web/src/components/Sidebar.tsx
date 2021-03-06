import React, { memo, FC } from "react"
import { Link, Match } from "@reach/router"
import { styled, lighten } from "@noquarter/ui"

import { media } from "../application/theme"
import useAppState from "../lib/hooks/useAppState"

import IconPlus from "../assets/images/icon-plus.svg"

import Logo from "./Logo"
import { useLogout } from "../lib/graphql/user/hooks"

function Sidebar({ open }: { open: boolean }) {
  const { group } = useAppState()
  const [logout] = useLogout()
  const handleLogout = () => logout()

  return (
    <StyledSidebar open={open}>
      <Logo />
      <div>
        <NavLink to="/">Balance</NavLink>
        {group && (
          <NavLink to="/new-cost">
            New cost <StyledIcon src={IconPlus} />
          </NavLink>
        )}
        <NavLink to="/costs">Costs</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <div tabIndex={0} onClick={handleLogout} style={{ cursor: "pointer" }}>
          <StyledLink>Logout</StyledLink>
        </div>
      </div>
      <StyledPlug>
        Built by{" "}
        <StyledAnchor
          tabIndex={-1}
          target="_black"
          rel="no-follow"
          href="https://www.noquarter.co"
        >
          No Quarter
        </StyledAnchor>
      </StyledPlug>
    </StyledSidebar>
  )
}

export default memo(Sidebar)

const NavLink: FC<{ to: string }> = ({ to = "/", children }) => {
  return (
    <Match path={to}>
      {({ match }) => (
        <Link to={to}>
          <StyledLink active={!!match}>{children}</StyledLink>
        </Link>
      )}
    </Match>
  )
}

const StyledSidebar = styled.div<{ open: boolean }>`
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  height: 100%;
  width: 220px;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  background-color: white;
  padding: ${p => p.theme.paddingXL};
  display: ${p => (p.open ? "flex" : "none")};

  ${media.greaterThan("sm")`
    display: flex;
  `}
`

const StyledLink = styled.div<{ active?: boolean }>`
  margin: ${p => p.theme.paddingL} 0;
  color: ${p => p.theme.colorText};
  padding-left: ${p => p.theme.paddingM};
  font-size: ${p => p.theme.textM};
  border-left: ${p =>
    p.active ? `2px solid ${p.theme.colorPrimary}` : "2px solid transparent"};

  &:hover {
    border-left: ${p =>
      p.active
        ? `2px solid ${p.theme.colorPrimary}`
        : `2px solid ${lighten(0.25, p.theme.colorPrimary)}`};
  }
`

const StyledIcon = styled.img`
  height: 30px;
  vertical-align: middle;
  border-radius: 50%;
  margin-left: ${p => p.theme.paddingS};
`

const StyledPlug = styled.div`
  font-size: ${p => p.theme.textS};
  color: ${p => p.theme.colorText};
`
const StyledAnchor = styled.a`
  color: ${p => p.theme.colorText};
  &:hover {
    color: ${p => p.theme.colorPrimary};
  }
`
