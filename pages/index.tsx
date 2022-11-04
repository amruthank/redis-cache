import { GetServerSideProps } from "next";
import internal from "stream";
import cache  from "./../src/cache";
import redis from "./../src/redis"

interface IProps {
  coupon: string | null;
}

export default function home( { coupon}: IProps){
  return (
      <div>
          {coupon ? (
              <h2> Your coupon is {coupon} </h2>
          ): (
              <h2> No coupon yet! </h2>
          )}
      </div>
  )
}


interface IPPPDATA{
  ppp:{
    pppConversionFactor: number;
  };
}


export const getServerSideProps: GetServerSideProps = async () => {

    const country = 'IN';

    const fetcher = async () => {
    
      const url = `https://api.purchasing-power-parity.com/?target=${country}`;
      
      const reponse = await fetch(url); // Call API
      const data: IPPPDATA = await reponse.json();
      console.log(data);

      let coupon: string | null = "Free" 
      if (data.ppp.pppConversionFactor <= 0.25){
          coupon = 'H025'
      }
      else if (data.ppp.pppConversionFactor > 0.25 && data.ppp.pppConversionFactor <= 0.50){
        coupon = 'H050'
      }
      else if (data.ppp.pppConversionFactor > 0.50 && data.ppp.pppConversionFactor <= 0.75){
        coupon = 'H075'
      }
      else{
        coupon = 'H0100'
      }

      return coupon
    };

    //cache.del(`ppp: ${country}`);

    const cachedCoupon = await cache.fetch(
      `ppp: ${country}`, 
      fetcher, 
      60*60
      );
    
    return { props: {coupon: cachedCoupon } };
};



