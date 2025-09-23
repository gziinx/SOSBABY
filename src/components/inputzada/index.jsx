import { Escreva, Brekman, Icon } from "./styles"

function Inputzada({ value, onChange, placeholder, type = "text", icon }) {
  return (
    <Brekman>
      <Icon>{icon}</Icon>
      <Escreva 
        type={type} 
        placeholder={placeholder} 
        required 
        value={value}
        onChange={onChange}
      />
    </Brekman>
  )
}

export default Inputzada
