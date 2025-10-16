import { maskCardNumber } from '../../../lib/format';
import visaPng from '../../../assets/icons/walletcard/visa-icon.png';
import chipPng from '../../../assets/icons/walletcard/simCard.png';
import wifiPng from '../../../assets/icons/walletcard/wifi.png';
import MoreIcon from '../../../assets/icons/walletcard/More.png';

type WalletCardData = {
  name?: string | null;
  bankLabel?: string | null;
  bank?: string | null; // e.g., 'Maglo | Commercial Bank'
  cardNumber?: string | null;
  expiry?: string | null; // MM/YY
  brand?: string | null; // 'VISA' | 'MASTERCARD' | etc.
};

export type WalletMiniCardProps = {
  cards?: WalletCardData[] | null;
  className?: string;
};

function parseNameParts(input?: string | null): { brandName: string; bankLabel: string } {
  if (!input) return { brandName: 'Maglo', bankLabel: 'Universal Bank' };
  const parts = input.split('•').map((s) => s.trim());
  if (parts.length >= 2) return { brandName: parts[0], bankLabel: parts[1] };
  return { brandName: input, bankLabel: 'Universal Bank' };
}

function parseBankParts(bank?: string | null, name?: string | null, bankLabel?: string | null): { left: string; right: string } {
  const src = (bank ?? '').trim();
  if (src) {
    const parts = src.split('|').map((p) => p.trim());
    return { left: parts[0] || 'Maglo', right: parts[1] || bankLabel || 'Universal Bank' };
  }
  const legacy = parseNameParts(name ?? undefined);
  return { left: legacy.brandName, right: bankLabel || legacy.bankLabel };
}

export default function WalletMiniCard({ cards }: WalletMiniCardProps) {
  const back: WalletCardData =
    cards?.[0] ?? ({
      name: 'Maglo',
      bankLabel: 'Universal Bank',
      bank: 'Maglo | Universal Bank',
      cardNumber: '5495 7381 3759 2321',
      expiry: '04/24',
      brand: 'MASTERCARD',
    } as const);

  const front: WalletCardData =
    cards?.[1] ?? ({
      name: 'Maglo',
      bankLabel: 'Commercial Bank',
      bank: 'Maglo | Commercial Bank',
      cardNumber: '85952548****',
      expiry: '09/25',
      brand: 'VISA',
    } as const);

  const backBank = parseBankParts(back.bank, back.name, back.bankLabel);
  const frontBank = parseBankParts(front.bank, front.name, front.bankLabel);

  console.log('WalletMiniCard render', { cards, back, front, backBank, frontBank });    

  return (
    <div className={['relative w-full py-5 bg-transparent'].join(' ')}>
      {/* Header row */}
      <div className="relative z-10 w-full flex items-center justify-between mb-[15px]">
        <div className="text-gray-800 text-lg font-semibold font-kumbh">Wallet</div>
        <div className="h-5 w-5 flex items-center justify-center text-gray-400">
          {/* <span className="block h-[3px] w-4 bg-gray-400 rounded" /> */}
          <img src={MoreIcon} alt="more" className="w-4 h-4" />
        </div>
      </div>

      {/* Cards canvas - keeps header free of overlap */}
      <div className="relative h-[340px]">
        {/* Back card (dark gradient) */}
        <div className="absolute left-0 top-0 w-full h-52 rounded-2xl text-white bg-gradient-to-br from-neutral-600 to-neutral-800 shadow-sm">
          <div className="absolute left-[30px] top-[18px] flex items-center gap-3">
            <div className="justify-start text-white text-base font-bold font-['Gordita']">{backBank.left}</div>
            <span className="text-zinc-600 text-sm">|</span>
            <div className="justify-start text-zinc-600 text-xs font-medium font-['Gordita']">{backBank.right}</div>
          </div>
          <div className="absolute left-[35px] top-[70px]">
            <img src={chipPng} alt="chip" className="w-9 h-7" />
          </div>
          <div className="absolute right-6 top-[60px] opacity-70">
            <img src={wifiPng} alt="contactless" className="w-8 h-8 " />
          </div>
          <div className="absolute left-[30px] bottom-[60px] tracking-widest text-white text-lg font-bold font-['Gordita']">
            {maskCardNumber(back.cardNumber ?? '') || '5495 7381 3759 2321'}
          </div>
          <div className="absolute left-[30px] bottom-[16px] text-zinc-400 text-sm font-medium tracking-tight font-['Gordita']">
            {back.expiry ?? '04/24'}
          </div>
          <div className="absolute right-6 bottom-5">
            <MastercardBadge />
          </div>
        </div>

        {/* Front card (glassmorphism) */}
        <div className="absolute left-[15px] top-[160px] w-[calc(100%-30px)] h-44 rounded-2xl border border-white/40 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-[5px] shadow">
          {/* top gloss to match Figma */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/10 to-transparent rounded-t-2xl" />
          <div className="absolute left-[20px] top-[16px] flex items-center gap-3">
            <div className="justify-start text-white text-base font-bold font-['Gordita']">{frontBank.left}</div>
            <span className="text-neutral-100 text-sm">|</span>
            <div className="justify-start text-neutral-100 text-xs font-medium font-['Gordita']">{frontBank.right}</div>
          </div>
          <div className="absolute left-[35px] top-[54px]">
            <img src={chipPng} alt="chip" className="w-9 h-7" />
          </div>
          <div className="absolute right-6 top-[50px] opacity-70">
            <img src={wifiPng} alt="contactless" className="w-8 h-8" />
          </div>
          <div className="absolute left-[20px] bottom-[36px] text-gray-800 text-base font-bold tracking-wider font-['Gordita'] whitespace-pre">
            {maskCardNumber(front.cardNumber ?? '') || ''}
          </div>
          <div className="absolute left-[20px] bottom-[14px] text-gray-400 text-xs font-medium tracking-tight font-['Gordita']">
            {front.expiry ?? '09/25'}
          </div>
          <div className="absolute right-6 bottom-4">
            <VisaBadge />
          </div>
        </div>
      </div>
    </div>
  );
}

function MastercardBadge() {
  return (
    <div className="flex items-center">
      <span className="w-6 h-6 rounded-full bg-red-600" />
      <span className="w-6 h-6 -ml-2 rounded-full bg-amber-500" />
    </div>
  );
}

function VisaBadge() {
  return <img src={visaPng} alt="VISA" className="h-6 w-auto" />;
}
