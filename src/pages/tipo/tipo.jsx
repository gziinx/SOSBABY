import React from "react";
import './tipo.css';
import bebe  from '../../assets/bebe.png';

return (
    <>
         <Header>
        <H1>QUEM É VOCE?</H1>
        <p>Escolha o tipo de conta que melhor representa você para <br/>
             começarmos sua jornada no SOS Baby.</p>
    </Header>
    <main>
        <div class="card">
            <div class="card-img">
                <img src={bebe} alt=""/>
            </div>
            <h2>Responsavel</h2>
            <p>Para pais e cuidadores que <br/>
                 desejam acompanhar o
                 <br/> desenvolvimento do bebe</p>
        </div>
        <div class="card">
            <div class="card-img">
                <img src={bebe} alt=""/>
            </div>
            <h2>Responsavel</h2>
            <p>Para pais e cuidadores que desejam acompanhar o desenvolvimento do bebe</p>
        </div>
        <div class="card">
            <div class="card-img">
                <img src={bebe} alt=""/>
            </div>
            <h2>Responsavel</h2>
            <p>Para pais e cuidadores que desejam acompanhar o desenvolvimento do bebe</p>
        </div>
    </main>
    </>
)