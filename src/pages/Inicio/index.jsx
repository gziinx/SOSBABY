import { Ola, Card, Textin, Casa, Logo } from "./styles"
import Buttu from "../../components/input1"
import { GlobalStyle, CadStyle } from "../../styles/GglobalStyles"
import foto from "../../assets/logoo.png";
import { Link } from "react-router-dom";

function Inicio (){


    return(
        <Ola>
                <GlobalStyle/>
                <Casa>
                        <Logo src= {foto} alt="Ali" />
                </Casa>
                <Card>
                <Textin>BEM VINDO!</Textin>
                <Link to="/cadastro">
                <Buttu>CRIAR CONTA</Buttu>
                </Link>

                <Buttu>ENTRAR</Buttu>
                </Card>
                
        </Ola>
    )
}

export default Inicio