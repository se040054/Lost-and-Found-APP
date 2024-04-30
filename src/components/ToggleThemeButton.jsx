import React from "react";
// import { func, string } from "prop-types";
import styled from "styled-components";

import { ReactComponent as MoonIcon } from "../assets/moon.svg";
import { ReactComponent as SunIcon } from "../assets/sun.svg";

import { useThemeContext } from "../context/ThemeContext";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useThemeContext();

  const ToggleThemeContainer = styled.button.attrs({
    className: `dark-mode-button  ${theme}`,
  })`
    background: ${({ theme }) => theme.gradient};
    border: 2px solid ${({ theme }) => theme.toggleBorder};
    border-radius: 30px;
    cursor: pointer;
    display: flex;
    font-size: 0.5rem;
    justify-content: space-between;
    margin: 0 auto;
    overflow: hidden;
    padding: 0.5rem;
    position: relative;
    width: 8rem;
    height: 4rem;

    svg {
      height: auto;
      width: 2.5rem;
      transition: all 0.3s linear;

      // sun icon
      &:first-child {
        transform: ${({ lightTheme }) =>
          lightTheme ? "translateY(0)" : "translateY(100px)"};
      }

      // moon icon
      &:nth-child(2) {
        transform: ${({ lightTheme }) =>
          lightTheme ? "translateY(-100px)" : "translateY(0)"};
      }
    }
  `;

  return (
    <ToggleThemeContainer
      lightTheme={theme === "light"}
      onClick={() => {
        toggleTheme?.();
      }}
    >
      {/*  注意這裡的onClick要用呼叫的 不要用掛載的 */}
      <SunIcon />
      <MoonIcon />
    </ToggleThemeContainer>
  );
};

// ToggleTheme.propTypes = { //檢查用但因為你預設null用不到
//   theme: string.isRequired,
//   toggleTheme: func.isRequired,
// };

export default ToggleTheme;
