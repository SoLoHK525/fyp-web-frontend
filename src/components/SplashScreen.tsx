import {PropsWithChildren, useEffect, useState} from "react";
import { CircularProgress, styled, Typography } from '@mui/material';
import {useAuthentication} from "../contexts/AuthenticationContext";

const SplashScreen = ({children}: PropsWithChildren) => {
  const auth = useAuthentication();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (auth.initialized) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 1250);

      return () => {
        clearTimeout(timeout);
      }
    }

  }, [auth.initialized]);

  return (
    <>
      <SplashScreenWrapper style={{opacity: auth.initialized ? 0 : 1, display: show ? 'flex' : 'none'}}>
        <Typography variant="h1" textTransform="uppercase" fontWeight="bold" color="white"><CircularProgress /></Typography>
      </SplashScreenWrapper>
    </>
  )
}

export default SplashScreen;

const SplashScreenWrapper = styled('div')(({theme}) => `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.palette.background.default};
  z-index: 10000;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  transition: all .25s ease-in-out;
  transition-delay: .5s;
`);