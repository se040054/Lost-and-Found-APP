import styled from "styled-components";

export default function AuthInputContainer({
  label,
  type,
  value,
  placeholder,
  onChange,
}) {
  return (
    <InputContainer>
      <Label htmlFor="">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </InputContainer>
  );
}

const InputContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: start;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.inputContainerBackground};
  width: 300px;
  height: 70px;
`;

const Label = styled.label`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
  text-align: start;
  font-weight: bold;
`;

const Input = styled.input`
  font-size: 18px;
  border: 1px solid ${({ theme }) => theme.inputContainerBorder};
  background-color: ${({ theme }) => theme.inputBackground};
  width: 150px;
  border-radius: 5px;
  padding: 9px 9px;
  min-width: 300px;
  font-family: "Noto Sans TC", sans-serif;
  font-weight: bold;
`;
