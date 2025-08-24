import styled from '@emotion/styled';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

// Static demo data – restricted to Aptos <-> Ethereum only as requested
const CHAINS = [
  { id: 'aptos', name: 'Aptos' },
  { id: 'eth', name: 'Ethereum' },
];

const TOKENS: Record<string, { symbol: string; name: string }[]> = {
  aptos: [{ symbol: 'mUSDC', name: 'Multi-Chain USDC' }],
  eth: [{ symbol: 'mUSDC', name: 'Multi-Chain USDC' }],
  // Only mUSDC supported on both chains per requirement
};

export const SwapBridgeBox: React.FC = () => {
  // Bridge only
  const [fromChain, setFromChain] = useState('aptos');
  const [toChain, setToChain] = useState('eth');
  const [fromToken, setFromToken] = useState('mUSDC');
  const [toToken, setToToken] = useState('mUSDC');
  const [amount, setAmount] = useState('');

  const handleSwitch = () => {
    setFromChain(toChain);
    setToChain(fromChain);
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const disabled = !amount || Number(amount) <= 0;
  const estReceive = amount ? amount : '0.0';

  return (
    <Wrapper aria-label="Bridge Box (demo)">
      <HeaderRow>
        <Title>Bridge Assets</Title>
        <Badge>Demo</Badge>
      </HeaderRow>
      <Subtle>Move assets securely across supported chains.</Subtle>
      <Content>
        <FieldGroup>
          <Label>From</Label>
          <Row>
            <Select
              aria-label="From Chain"
              value={fromChain}
              onChange={(e) => {
                setFromChain(e.target.value);
                const firstToken = TOKENS[e.target.value][0];
                setFromToken(firstToken.symbol);
              }}
            >
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              aria-label="From Token"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
            >
              {TOKENS[fromChain].map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </Select>
            <AmountInput
              placeholder="0.0"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Row>
        </FieldGroup>

        <SwitchButton
          type="button"
          onClick={handleSwitch}
          aria-label="Switch direction"
        >
          ⇅
        </SwitchButton>

        <FieldGroup>
          <Label>To</Label>
          <Row>
            <Select
              aria-label="To Chain"
              value={toChain}
              onChange={(e) => {
                setToChain(e.target.value);
                const firstToken = TOKENS[e.target.value][0];
                setToToken(firstToken.symbol);
              }}
            >
              {CHAINS.filter((c) => c.id !== fromChain).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              aria-label="To Token"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
            >
              {TOKENS[toChain].map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol}
                </option>
              ))}
            </Select>
            <PreviewAmount>
              {amount ? `≈ ${estReceive} ${toToken}` : '—'}
            </PreviewAmount>
          </Row>
        </FieldGroup>

        <MetaRow>
          <MetaItem>
            <span>Fee</span>
            <strong>~ 0.05%</strong>
          </MetaItem>
          <MetaItem>
            <span>ETA</span>
            <strong>~ 45s</strong>
          </MetaItem>
          <MetaItem>
            <span>Slippage</span>
            <strong>0.50%</strong>
          </MetaItem>
        </MetaRow>

        <Action>
          <Button
            variant="secondary"
            className="w-full font-bold"
            disabled={disabled}
            onClick={() => {
              // Placeholder action
              // eslint-disable-next-line no-alert
              alert(`Bridging ${amount} ${fromToken} to ${toToken}`);
            }}
          >
            Bridge
          </Button>
        </Action>
        <Disclaimer>
          Demo UI only. Actual demonstration presented by the creator.
        </Disclaimer>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  --glass-bg: rgba(16, 24, 28, 0.55);
  --glass-border: rgba(120, 255, 229, 0.35);
  --glass-glow: rgba(80, 227, 194, 0.25);
  --accent: #50e3c2;
  --text-primary: #e6f7f5;
  --text-secondary: #89a9a6;
  position: relative;
  width: 100%;
  max-width: 520px;
  padding: 22px 22px 26px;
  border-radius: 28px;
  background: linear-gradient(
      155deg,
      rgba(80, 227, 194, 0.08) 0%,
      rgba(80, 227, 194, 0.015) 60%
    ),
    var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow:
    0 0 0 1px rgba(80, 227, 194, 0.22) inset,
    0 2px 8px -2px rgba(0, 0, 0, 0.55),
    0 12px 48px -12px rgba(0, 0, 0, 0.65),
    0 0 64px -12px var(--glass-glow);
  backdrop-filter: blur(26px) saturate(180%);
  -webkit-backdrop-filter: blur(26px) saturate(180%);
  display: flex;
  flex-direction: column;
  gap: 18px;
  color: var(--text-primary);
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
        circle at 18% 12%,
        rgba(80, 227, 194, 0.25) 0%,
        transparent 55%
      ),
      radial-gradient(
        circle at 85% 88%,
        rgba(80, 227, 194, 0.18) 0%,
        transparent 60%
      );
    mix-blend-mode: screen;
    opacity: 0.9;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(100deg, #ffffff 0%, #b0fff1 60%, #50e3c2 100%);
  -webkit-background-clip: text;
  color: transparent;
`;
const Badge = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.75px;
  padding: 4px 8px 3px;
  border-radius: 8px;
  background: rgba(80, 227, 194, 0.14);
  border: 1px solid rgba(80, 227, 194, 0.4);
  color: #b5fff0;
  text-transform: uppercase;
`;
const Subtle = styled.p`
  margin: -6px 0 2px;
  font-size: 12px;
  line-height: 1.35;
  color: var(--text-secondary);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Label = styled.span`
  font-size: 12px;
  letter-spacing: 0.75px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-secondary);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  align-items: center;
  @media (max-width: 560px) {
    grid-template-columns: 1fr 1fr;
    & > :nth-of-type(3) {
      grid-column: span 2;
    }
  }
`;

const baseFieldStyles = `
  background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(160, 255, 239, 0.15);
  box-shadow: 0 0 0 1px rgba(120,255,229,0.08) inset, 0 2px 4px -2px rgba(0,0,0,0.6);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border-radius: 14px;
  outline: none;
  color: #f2fffd;
  font-weight: 500;
  transition: border-color 0.18s, background 0.18s;
  &:focus {
    border-color: rgba(80, 227, 194, 0.7);
    background: linear-gradient(145deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 100%);
  }
`;

const Select = styled.select`
  ${baseFieldStyles};
  padding: 10px 12px;
  font-size: 14px;
  appearance: none;
  /* Override to black text & lighter background for dropdown */
  color: #000;
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(0, 0, 0, 0.15);
  &:focus {
    border-color: rgba(0, 0, 0, 0.4);
    background: rgba(255, 255, 255, 0.95);
  }
  option {
    color: #000;
    background: #fff;
  }
`;

const AmountInput = styled.input`
  ${baseFieldStyles};
  padding: 12px 14px;
  font-size: 16px;
  letter-spacing: 0.5px;
`;

const PreviewAmount = styled.div`
  ${baseFieldStyles};
  padding: 12px 14px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #b7d8d4;
  font-weight: 500;
`;

const SwitchButton = styled.button`
  position: relative;
  background: linear-gradient(
    145deg,
    rgba(80, 227, 194, 0.15),
    rgba(80, 227, 194, 0.05)
  );
  border: 1px solid rgba(80, 227, 194, 0.45);
  border-radius: 14px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -4px auto -4px;
  font-size: 20px;
  cursor: pointer;
  color: #d8fff8;
  box-shadow:
    0 4px 16px -4px rgba(80, 227, 194, 0.45),
    0 0 0 1px rgba(80, 227, 194, 0.3) inset;
  transition: all 0.25s;
  backdrop-filter: blur(20px) saturate(160%);
  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(
      145deg,
      rgba(80, 227, 194, 0.25),
      rgba(80, 227, 194, 0.08)
    );
  }
  &:active {
    transform: translateY(0);
  }
`;

const MetaRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 8px 4px 0;
`;
const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  span {
    font-weight: 600;
    text-transform: uppercase;
    font-size: 10px;
    color: #6e8b88;
  }
  strong {
    font-size: 12px;
    font-weight: 600;
    color: #cffff7;
  }
`;

const Action = styled.div`
  margin-top: 4px;
`;

const Disclaimer = styled.p`
  margin: 8px 0 0;
  font-size: 10.5px;
  line-height: 1.3;
  color: #66807d;
  text-align: center;
  letter-spacing: 0.3px;
`;
