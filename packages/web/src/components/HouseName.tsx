import React, { useState, useRef, memo } from "react"
import styled from "../application/theme"
import { GetHouse } from "../lib/graphql/types"
import { useEditHouseMutation } from "../lib/graphql/house/hooks"

type HouseNameProps = {
  house: GetHouse.House
}

function HouseName({ house }: HouseNameProps) {
  const [houseName, setHouseName] = useState<string>(house.name)
  const inputRef = useRef<HTMLInputElement>(null)
  const updateHouse = useEditHouseMutation()

  const handleHouseUpdate = (e: any) => {
    if (e.key === "Enter") {
      if (!houseName) return setHouseName(name)
      updateHouse({
        variables: {
          houseId: house.id,
          data: {
            name: houseName,
          },
        },
        optimisticResponse: {
          __typename: "Mutation",
          editHouse: {
            ...house,
            name: houseName,
            __typename: "House",
          },
        },
      })
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }
  return (
    <StyledInput
      ref={inputRef}
      value={houseName}
      onBlur={handleHouseUpdate}
      onKeyPress={handleHouseUpdate}
      onChange={e => setHouseName(e.target.value)}
    />
  )
}

export default memo(HouseName)

const StyledInput = styled.input`
  outline: 0;
  width: 100%;
  border: 0;
  border: 2px solid transparent;
  border-radius: ${p => p.theme.borderRadius};
  font-size: ${p => p.theme.textL};
  font-weight: ${p => p.theme.fontBlack};

  &:hover,
  &:focus {
    border: 2px solid ${p => p.theme.colorLightGrey};
  }
`