import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Timer from '../../components/Timer'
import { MdOutlineTimer } from 'react-icons/md'
import { RiErrorWarningLine } from 'react-icons/ri'
import { QRCodeSVG } from 'qrcode.react';


const Resumen = () => {
  const [orderDetail, setOrderDetail] = useState('')
  const [walletSelection, setWalletSelection] = useState('1')

  useEffect(() => {
    const id = window.location.pathname.slice(9)
    getOrder(id)
  }, []);



  const getOrder = async (id) => {
    let config = {
      method: "get",
      url: `https://payments.smsdata.com/api/v1/orders/info/${id}`,
      headers: {
        "X-Merchant-Id": "cf9b0d0a-a971-4347-a874-f0677c9af7aa",
      },
    };
    await axios(config)
      .then((response) => {
        const result = response.data[0]
        setOrderDetail(result)
      })
      .catch((error) => {
        console.log(`This is axios error ${error}`);
      });
  };

  const ConexionButton = () =>{
    const [buttonText, setButtonText] = useState('Conectar wallet');
    const [account, setAccount] = useState(null);

    const conectWallet = ()=>{
      if(window.ethereum && window.ethereum.isMetaMask){
        // Metamask installed
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result =>{
          setAccount(result[0])
          setButtonText(null)
        })
        .catch(error =>{
          setButtonText(error.message)
        })
      }else{
        //not installed
        setButtonText('Necesitas tener metamask instalado')
      }
    }
    return(
      <div className='flex gap-1 bg-[#ffff] rounded-full py-6 px-8'>
        <img className='w-[30px]' src='https://i.ibb.co/kMPsccW/Metamask-icon.png' alt='logo_metamask'></img>
        <button onClick={conectWallet}>{buttonText}{account}</button>
      </div>
    )
  };




  return (
    <div className="w-full h-screen flex items-center">
      <div className="w-[80%] my-0 mx-auto flex gap-10">
        <div className="w-3/6 my-0 mx-auto ">
          <h4 className="px-5 mb-3">Resumen del pedido</h4>
          <div className="bg-[#F9FAFC] flex flex-col gap-6 px-5 h-[489px] rounded-lg">
            <div className="flex justify-between border-b-2 py-5 ">
              <h5>Importe:</h5>
              <h5>{orderDetail.fiat_amount} {orderDetail.fiat}</h5>
            </div>

            <div className="flex justify-between border-b-2 py-5 ">
              <h5>Moneda seleccionada:</h5>
              <div className={"flex gap-3"}>
                <img 
                src={orderDetail.currency_id === 'BTC_TEST' ? 'https://i.ibb.co/3109JZf/bitcoin.png': 'https://i.ibb.co/hCg6tJ2/ethereum.png'}
                className={"w-[25px] "} 
                />
                <p>{orderDetail ? orderDetail.currency_id.slice(0, 3) : null}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 py-5 border-b-2">
              <div className="flex justify-between">
                <h6>Comercio:</h6>
                <span>La tiendecita</span>
              </div>
              <div className="flex justify-between">
                <h6>Fecha:</h6>
                <span>{orderDetail ? orderDetail.created_at.split('T')[0] : null} {orderDetail ? orderDetail.created_at.split('T')[1].slice(0, 5) : null}</span>
              </div>
            </div>
            <div className="flex justify-between py-5">
              <h6>Concepto:</h6>
              <span>{orderDetail.notes}</span>
            </div>

          </div>
        </div>
        <div className="w-3/6 my-0 mx-auto ">
          <h4>Realiza el pago</h4>
          <div className="bg-[#F9FAFC] flex flex-col gap-6 px-5 h-[489px] rounded-lg">
            <div className='timer flex justify-center py-3'>
              <div className='text-[22px]'>
                <MdOutlineTimer />
              </div>
              <Timer />
            </div>
            <div className='options flex justify-center gap-3'>
                <span onClick={() => setWalletSelection('1')} className='hover:bg-[#035AC5] hover:text-white rounded-lg py-2 px-1'>Smart QR</span>
                <span className='hover:bg-[#035AC5] hover:text-white rounded-lg border-x-2 py-2 px-1'>Wallet QR</span>
                <span onClick={() => setWalletSelection('2')} className='hover:bg-[#035AC5] hover:text-white  rounded-lg py-2 px-1'>Metamask</span>
            </div>
            <div className='qr flex justify-center h-2/4  items-center'>
             {walletSelection === '1'? 
             <div className='bg-white px-10 py-10'>
                 <QRCodeSVG value={orderDetail.address}/>
              </div>: ''
              }
              {walletSelection === '2'?
               <div className='px-10 py-10'>
               <ConexionButton/>
            </div>:''}
            </div>
            <div className='final-text text-center'>
                <div className='flex justify-center'>
                  <span className='mr-1'>Enviar</span>
                  <h4>{orderDetail.crypto_amount} {orderDetail? orderDetail.currency_id.slice(0,3):null}</h4>
                </div>
                <p className='py-2'>{orderDetail.address}</p>
                <div className='flex justify-center'>
                  <div className='text-yellow-500 mr-2 mt-1'>
                    <RiErrorWarningLine/>
                  </div>
               
               <span>Etiqueta de destino: </span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resumen