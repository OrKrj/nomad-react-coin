import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useMatch } from "react-router-dom";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

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
  background-color: rgba(0, 0, 0, 0.5);
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 10px;
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

interface PriceInfo {
  total_supply: number;
  max_supply: number;
}

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

function Coin() {
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
  );

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
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
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source:</span>
              <span>{infoData?.open_source ? "Yes" : "No"}</span>
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

          <Outlet />
        </>
      )}
    </Container>
  );
}

export default Coin;
