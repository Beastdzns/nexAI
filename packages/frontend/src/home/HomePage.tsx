import {
  APTOS_COIN,
  Account,
  AnyRawTransaction,
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
} from '@aptos-labs/ts-sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { NextPage } from 'next';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import aptosAssistantIllust from '@/assets/aptos-assistant-fit.png';
import monkeyAnimation from '@/assets/monkey_animation.mp4';

import { AssistantMessageItem } from './components/AssistantMessageItem';
import { ParameterType } from './components/Block';
import { ErrorMessageItem } from './components/ErrorMessageItem';
import { NavigationBar } from './components/NavigationBar';
import { ToolMessageItem } from './components/ToolMessageItem';
import { UserMessageItem } from './components/UserMessageItem';
import { FeaturedSection } from './sections/FeaturedSection';
import { InputSection } from './sections/InputSection';
import { fetchStreamingResponse } from './stream';
import { Message } from './types';

const Coins = {
  APT: {
    name: 'APT',
    symbol: 'APT',
    decimals: 8,
    type: APTOS_COIN,
  },
};

type Address = `0x${string}`;

const config = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(config);

const defaultAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(
    '0x8770b1199261ee6ba4ce12cb11cf3dcf3b9fbf0a9bf9062ae00242fb9d686e3a',
  ),
});

const executeTx = async (
  signer: Account,
  transaction: AnyRawTransaction,
  update: (params: Record<string, ParameterType>) => void,
) => {
  const pendingTxn = await aptos.signAndSubmitTransaction({
    signer: signer,
    transaction,
  });
  console.log({ pendingTxn });

  update({
    transaction: {
      type: 'hash',
      value: pendingTxn.hash,
    },
    status: { type: 'string', value: 'Pending' },
  });

  const response = await aptos.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });
  console.log(response);

  update({
    status: {
      type: 'string',
      value: response.success ? 'Success' : 'Failed',
    },
    gas: {
      type: 'coin',
      coin: Coins.APT,
      value: BigInt(response.gas_used) * BigInt(pendingTxn.gas_unit_price),
    },
    gasUnitPrice: {
      type: 'coin',
      coin: Coins.APT,
      value: BigInt(pendingTxn.gas_unit_price),
    },
    block: {
      type: 'string',
      value: 'Loading...',
    },
  });

  const blockInfo = await aptos.getBlockByVersion({
    ledgerVersion: Number(response.version),
  });
  console.log(blockInfo);

  update({
    block: {
      type: 'block',
      value: blockInfo.block_height,
    },
  });
};

const HomePage: NextPage = () => {
  const { account, connected, wallet, changeNetwork } = useWallet();

  const [accounts, setAccounts] = useState<Record<Address, Account>>({
    [defaultAccount.accountAddress.toString()]: defaultAccount,
  });

  const [draft, setDraft] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) {
        return;
      }
      if (!draft) {
        // empty check
        return;
      }
      setDraft('');

      setIsLoading(true);
      const newMessage: Message = { role: 'user', content: draft };
      setMessages((prev) => [...prev, newMessage]);

      abortControllerRef.current = new AbortController();

      try {
        await fetchStreamingResponse(
          [...messages, newMessage],
          setMessages,
          abortControllerRef.current.signal,
          account?.address || '0x0',
        );
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            content: (error as Error).toString(),
          },
        ]);
      } finally {
        setIsLoading(false);
        setDraft('');
        abortControllerRef.current = null;
      }
    },
    [draft, messages, isLoading, account?.address],
  );

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  // (Removed snap scrolling; allow natural page scroll)
  // const bottomBarRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    // Scroll chat area to bottom when messages update
    const el = chatScrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages]);

  return (
    <>
      <NavWrapper>
        <NavigationBar
          onClickHome={() => {
            setMessages([]);
          }}
        />
      </NavWrapper>
      <SectionOne>
        <DecorationLeft aria-hidden="true">
          <Image
            src="/assets/left.png"
            alt=""
            width={320}
            height={640}
            priority
          />
        </DecorationLeft>
        <DecorationRight aria-hidden="true">
          <Image
            src="/assets/right.png"
            alt=""
            width={320}
            height={640}
            priority
          />
        </DecorationRight>
        <ContentArea>
          {messages.length === 0 && (
            <Image
              className="w-[100px] h-[100px]"
              src="/assets/3d-aptos-compact.png"
              alt=""
              width={512}
              height={512}
            />
          )}
          <Main>
            {messages.length > 0 && (
              <>
                <ChatScroll ref={chatScrollRef}>
                  <MessageList>
                    {messages.map((message, index) => {
                      if (message.role === 'user') {
                        return (
                          <UserMessageItem key={index} message={message} />
                        );
                      }
                      if (message.role === 'assistant') {
                        return (
                          <AssistantMessageItem key={index} message={message} />
                        );
                      }
                      if (message.role === 'tool') {
                        return (
                          <ToolMessageItem
                            key={index}
                            id={index.toString()}
                            message={message}
                          />
                        );
                      }
                      return <ErrorMessageItem key={index} message={message} />;
                    })}
                  </MessageList>
                  <motion.div
                    animate={isLoading ? { scale: [1, 0.66, 1] } : undefined}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ width: 100, height: 100, marginRight: 'auto' }}
                  >
                    <Image alt="" src={aptosAssistantIllust} />
                  </motion.div>
                </ChatScroll>
              </>
            )}
            {messages.length === 0 && (
              <FeaturedSection
                onSelect={(text) => {
                  setDraft(text);
                  textareaRef.current?.focus();
                }}
              />
            )}
            <InputSection
              isLoading={isLoading}
              onClickSubmit={handleSubmit}
              onStop={handleStop}
              value={draft}
              onChangeValue={handleInputChange}
            />
          </Main>
        </ContentArea>
      </SectionOne>
      <MonkeySection aria-hidden="true">
        <VideoBackground
          src={monkeyAnimation as unknown as string}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </MonkeySection>
    </>
  );
};

export default HomePage;

const NavWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
`;

const SectionOne = styled.section`
  position: relative;
  height: 100vh; /* lock to viewport */
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 64px; /* space for navbar */
  overflow: hidden;
`;

const DecorationBase = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  opacity: 0.9;

  @media (max-width: 1100px) {
    display: none;
  }

  img,
  span > img {
    width: 320px !important;
    height: 100%;
    object-fit: cover;
  }
`;

const DecorationLeft = styled(DecorationBase)`
  left: 0;
`;

const DecorationRight = styled(DecorationBase)`
  right: 0;
`;
const Sidebar = styled.nav`
  width: 280px;
  background-color: black;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
`;

const ContentArea = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 100%;
  height: calc(100vh - 64px);
  margin: 0 auto;
  padding: 32px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MonkeySection = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: black;
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  filter: brightness(0.9);
`;

const Main = styled.main`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0; /* allow flex child overflow */
`;

const ChatScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 3px;
  }
`;

const MessageList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
