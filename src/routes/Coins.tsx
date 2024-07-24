import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import defaultCoinImg from "../icons/ crypto_currency.png";
import { Helmet } from "react-helmet";
import { useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  margin-top: 15px;
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const CoinList = styled.ul`
  margin: 30px 15px;
`;

const Coin = styled.li`
  background-color: ${(props) => props.theme.listColor};
  color: ${(props) => props.theme.bgColor};
  border: 2px solid ${(props) => props.theme.listBorder};
  padding: 20px;
  margin-bottom: 12px;
  border-radius: 15px;

  a {
    display: flex;
    align-items: center;
    transition: color 0.2s ease-in;
    color: ${(props) => props.theme.textColor};
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Loader = styled.span`
  margin-top: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 20px;
`;

interface ApiCoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkMode = () => setDarkAtom((prev) => !prev);

  const { isLoading, data } = useQuery<ApiCoinInterface[]>(
    "allCoins",
    fetchCoins
  );

  return (
    <Container>
      <Helmet>
        <title>코인</title>
      </Helmet>
      <Header>
        <Title>코인</Title>
        <button onClick={toggleDarkMode}>Dark Mode</button>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinList>
          {data?.slice(0, 100).map((coin) => (
            <Coin>
              <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                <Img
                  src={`https://cryptoicon-api.pages.dev/api/icon/${coin.symbol.toLowerCase()}`}
                  onError={(e) => {
                    e.currentTarget.src = defaultCoinImg;
                  }}
                />
                {coin.name} 🚀
              </Link>
            </Coin>
          ))}
        </CoinList>
      )}
    </Container>
  );
}

export default Coins;
