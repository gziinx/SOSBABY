import InputWhite from "../../components/inputwhite";
import { CadoisStyle } from "../../styles/GglobalStyles";
import { Logo, LogoImg, TituDiv, Section, Identificacao } from "./style";
import logu from "../../assets/logu.png"
import { useState } from "react";

function Cadrespon (){
    const [nome, setNome] = useState("");
    return(<div>
            <Logo>
            <LogoImg src={logu}/>
        </Logo>
        <TituDiv>
            <p>DADOS DO RESPONSAVEL</p>
        </TituDiv>
        <form >
            <CadoisStyle/>
            <Section>
                <Identificacao>Identificação</Identificacao>
                <InputWhite label="Nome completo *" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite o nome completo" required />
            </Section>
        </form>
        </div>
    )
}
export default Cadrespon