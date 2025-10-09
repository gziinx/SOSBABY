import { Nav, A, Logu, NavLeft, NavCenter, NavRight, ButtonCriar, Icon } from "./style"
import logoo from "../../assets/logoo.png"
import { Bell, User } from "lucide-react"

function Cima() {
  return (
    <header>
      <Nav>
        <NavLeft>
          <Logu src={logoo} alt="SOS Baby" />
        </NavLeft>

        <NavCenter>
          <A href="#">Home</A>
          <A href="#">Calendário</A>
          <A href="#">Dicas</A>
          <A href="#">Consultas</A>
          <A href="#">Rotina</A>
        </NavCenter>

        <NavRight>
          <ButtonCriar>+ Criar</ButtonCriar>
          <Icon><Bell size={22} /></Icon>
          <Icon><User size={22} /></Icon>
        </NavRight>
      </Nav>
    </header>
  )
}

export default Cima
