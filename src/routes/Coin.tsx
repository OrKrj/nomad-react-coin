import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useMatch } from "react-router-dom";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
  color: ${(props) => props.theme.textColor};
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

const Loader = styled.span`
  margin-top: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 20px;
  display: block;
`;

const Overview = styled.div`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.listColor};
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 10px;
  border: 3px solid ${(props) => props.theme.listBorder};
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span:first-child {
    font-size: 15px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

interface Info {
  rank: number;
  symbol: string;
  open_source: boolean;
  description: string;
  name: string;
}

interface Quotes {
  price: number;
  volume_24h: number;
  volume_24h_change_24h: number;
  market_cap: number;
  market_cap_change_24h: number;
  percent_change_15m: number;
  percent_change_30m: number;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  percent_change_1y: number;
  ath_price: number;
  ath_date: string;
  percent_from_price_ath: number;
}

interface PriceInfo {
  total_supply: number;
  max_supply: number;
  quotes: { USD: Quotes };
}

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 25px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.listColor};
  padding: 8px 0px;
  border-radius: 10px;
  border: 3px solid ${(props) => props.theme.listBorder};
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface ICoinProps {
  isDark: boolean;
}

function Coin({ isDark }: ICoinProps) {
  const { coinId } = useParams() as { coinId: string };
  const { state } = useLocation() as { state: { name: string } };

  const chartMatch = useMatch("/:coinId/chart");
  const priceMatch = useMatch("/:coinId/price");
  const coinPageMatch = useMatch("/coin");

  // const [loading, setLoading] = useState(true);
  // const [info, setInfo] = useState<Info | null>(null);
  // const [priceInfo, setPriceInfo] = useState<PriceInfo | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, [coinId]);

  const { isLoading: infoLoading, data: infoData } = useQuery<Info>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceInfo>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
    // { refetchInterval: 5000 }
  );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name || (loading ? "Loading..." : infoData?.name)}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name || (loading ? "Loading..." : infoData?.name)}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>{`$${tickersData?.quotes.USD.price.toFixed(2)}`}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Supply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={coinPageMatch !== null}>
              <Link to={"/"}>Home</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>

          <Outlet context={{ coinId, isDark }} />
        </>
      )}
    </Container>
  );
}

export default Coin;
