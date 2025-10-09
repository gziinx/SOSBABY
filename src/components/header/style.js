import styled from "styled-components"

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 0 40px;
  height: 80px;
  width: 100vw;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
`

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Logu = styled.img`
margin-top: 20px;
  height: 80px;
  width: auto;
`

export const NavCenter = styled.div`
  display: flex;
  gap: 35px;
`

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export const A = styled.a`
  text-decoration: none;
  color: #000;
  font-size: 16px;
  font-weight: 500;
  transition: 0.2s ease;
  &:hover {
    color: #4a64f5;
  }
`

export const ButtonCriar = styled.button`
  background-color: #4a64f5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #3549c7;
  }
`

export const Icon = styled.div`
  color: #4a64f5;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.7;
  }
`
