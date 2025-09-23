import { Ola, Card, Textin } from "./styles"
import Buttu from "../../components/input1"
import GlobalStyle  from "../../styles/GglobalStyles"

function Inicio (){


    return(
        <Ola>
                <GlobalStyle/>
                <h1>ola</h1>
                <Card>
                <Textin>BEM VINDO!</Textin>
                <Buttu>CRIAR CONTA</Buttu>
                <Buttu>ENTRAR</Buttu>
                </Card>
                
        </Ola>
    )
}

export default Inicio