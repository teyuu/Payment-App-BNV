import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Payment = () => {
  useEffect(() => {
    getCurrencies();
  }, []);

  const router = useRouter();
  const [info, setInfo] = useState({
    importe: "",
    concepto: "",
    nextToResume: false,
    currencies: [],
    selectedCurrency: "",
    date: Date(Date.now()),
  });

  const getCurrencies = async () => {
    let config = {
      method: "get",
      url: "https://payments.smsdata.com/api/v1/currencies",
      headers: {
        "X-Merchant-Id": "cf9b0d0a-a971-4347-a874-f0677c9af7aa",
      },
    };
    await axios(config)
      .then((response) => {
        setInfo({
          ...info,
          currencies: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitCreatePayment = (e) => {
    e.preventDefault();
    setInfo({
      ...info,
      nextToResume: !info.nextToResume,
    });
  };

  const handleSubmitConfirmPayment = () => {
    const savedInfo = JSON.stringify({
      expected_output_amount: Number(info.importe),
      input_currency: info.selectedCurrency,
      merchant_urlok: "https://bitnovo.com/ok",
      merchant_urlko: "https://bitnovo.com/ko",
      notes: info.concepto,
    });

    let config = {
      method: "post",
      url: "https://payments.smsdata.com/api/v1/orders/",
      headers: {
        "X-Merchant-Id": "cf9b0d0a-a971-4347-a874-f0677c9af7aa",
        "Content-Type": "application/json",
      },
      data: savedInfo,
    };

    axios(config)
      .then((response) => {
        router.push(`/resumen/${response.data.identifier}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectOnChange = (e) => {
    setInfo({
      ...info,
      selectedCurrency: e.target.value,
    });
  };

  if (info.nextToResume) {
    return (
      <div className="w-full h-screen flex items-center">
        <div className="w-[80%] my-0 mx-auto flex gap-10">
          <div className="w-3/6 my-0 mx-auto">
            <h4 className="px-5 mb-3">Resumen del pedido</h4>
            <div className="bg-[#F9FAFC] flex flex-col gap-6 px-5 h-[489px] rounded-lg">
              <div className="flex justify-between border-b-2 py-5 ">
                <h5>Importe:</h5>
                <h5>{info.importe} EUR</h5>
              </div>
              {info.selectedCurrency
                ? info.currencies
                    .filter((e) => e.symbol === info.selectedCurrency)
                    .map((e) => {
                      return (
                        <div
                          className="flex justify-between border-b-2 py-5 "
                          key={e.name}
                        >
                          <h5>Moneda seleccionada:</h5>
                          <div className={"flex gap-3"}>
                            <img src={e.image} className={"w-[25px] "} />
                            <p>{e.name.split(" ")[1]}</p>
                          </div>
                        </div>
                      );
                    })
                : ""}
              <div className="flex flex-col gap-3 py-5 border-b-2">
                <div className="flex justify-between">
                  <h6>Comercio:</h6>
                  <span>La tiendecita</span>
                </div>
                <div className="flex justify-between">
                  <h6>Fecha:</h6>
                  <span>{info.date.substr(0, 24)}</span>
                </div>
              </div>
              <div className="flex justify-between py-5">
                <h6>Concepto:</h6>
                <span>{info.concepto}</span>
              </div>
              <button
                className="bg-[#0465DD] text-white w-[609px] h-[52px]"
                onClick={handleSubmitConfirmPayment}
                disabled={!info.selectedCurrency}
              >
                Confirmar pago
              </button>
            </div>
          </div>
          <div className="w-3/6 h-2/4">
            <span className="text-[#8492A6]">Seleccionar moneda</span>
            <div>
              <select
                className="border w-[608px] h-[60px] rounded-md bg-[#D3DCE6]"
                onChange={(e) => selectOnChange(e)}
              >
                <option disabled={info.selectedCurrency}>
                  Selecciona la moneda
                </option>
                {info.currencies
                  ? info.currencies.map((e) => {
                      return (
                        <option
                          key={e.name}
                          value={e.symbol}
                          className={"bg-[#FFFFFF]"}
                        >
                          {e.name}
                        </option>
                      );
                    })
                  : "cargando"}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-screen flex items-center">
      <div className=" w-auto h-2/4 my-0 mx-auto ">
        <h2 className="text-[32px] leading-[44px]">Crear pago</h2>
        <form onSubmit={(e) => handleSubmitCreatePayment(e)}>
          <div className="flex flex-col py-3">
            <label>Importe a pagar</label>
            <input
              name="importe"
              value={info.importe}
              onChange={(e) => {
                handleOnChange(e);
              }}
              className="bg-[#F5F5F5] border-2 w-[609px] h-[60px]"
              type="number"
              placeholder="56,06 EUR"
            />
          </div>
          <div className="flex flex-col py-3">
            <label>Concepto</label>
            <input
              name="concepto"
              value={info.concepto}
              onChange={(e) => {
                handleOnChange(e);
              }}
              className="bg-[#F5F5F5] border-2  w-[609px] h-[60px]"
              type="text"
              placeholder="Compra de XXXX"
            />
          </div>

          {info.importe && info.concepto ? (
            <button
              className="bg-[#0465DD] text-white w-[609px] h-[52px]"
              type="submit"
            >
              Crear pago
            </button>
          ) : (
            <button
              className="bg-[#0465DD] text-white w-[609px] h-[52px]"
              type="submit"
              disabled
            >
              Crear pago
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Payment;
