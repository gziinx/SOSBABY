import { styled } from "styled-components";

export const Brekman = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  font-family: 'Krona One', sans-serif;
`;

export const Escreva = styled.input`
  border: 3px solid #8AA9FF;
  border-radius: 30px;
  padding: 12px 16px;
  font-size: 16px;
  font-family: 'Krona One', sans-serif;
  box-sizing: border-box;
  transition: border 0.3s;
  width: 100%;
  outline: none;
  height: 50px;

  &.textarea {
    height: 150px;
  }
`;
