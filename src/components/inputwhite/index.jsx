import { Brekman, Escreva, Label } from "./style";

function InputWhite({ label, value, onChange, placeholder, type = "text", as = "input", options = [] }) {
  return (
    <Brekman>
      {label && <Label>{label}</Label>}

      {as === "input" && (
        <Escreva
          as="input"
          type={type}
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
        />
      )}

      {as === "textarea" && (
        <Escreva
          as="textarea"
          placeholder={placeholder}
          required
          value={value}
          onChange={onChange}
        />
      )}

      {as === "select" && (
        <Escreva
          as="select"
          value={value}
          onChange={onChange}
          required
        >
          <option value="">Selecione...</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </Escreva>
      )}
    </Brekman>
  );
}

export default InputWhite
