import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWalletButton } from "../ui/connect-button"
import { workSans } from "@/pages/app"
import { EthereumIcon } from "@/assets/icons/ethereum-icon"

const Buysell = () => {
  const [activeTab, setActiveTab] = useState("buy")
  const amounts = ["0.1", "0.25", "0.5", "1", "5"]

  return (
    <Card className="h-full w-full max-w-xl/2 bg-[#0e0e0e] text-white">
      <CardContent className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#1b1c1d]">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-white data-[state=active]:text-black"
            >
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {amounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="bg-[#1b1c1d] border-[#242626] text-white hover:bg-[#242626] hover:text-white"
            >
              {amount} ETH
            </Button>
          ))}
        </div>

        <ExchangeInput label="FROM" />
        <ExchangeInput label="TO" />

        <div className="flex justify-between text-sm">
          <div className="text-left space-y-1">
            <p className="text-[#aeb3b6]">Price Impact</p>
            <p className="text-[#aeb3b6]">Exchange</p>
          </div>
          <div className="space-y-1 text-right">
            <p>0.00%</p>
            <p className="text-2xl">-</p>
          </div>
        </div>

        <ConnectWalletButton icons={false} className="w-full bg-white text-black hover:bg-gray-200" />
      </CardContent>
    </Card>
  )
}

function ExchangeInput({ label }: { label: string }) {
  return (
    <Card className="bg-[#1b1c1d] border-0">
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <p className="text-left text-[#aeb3b6] text-sm">{label}</p>
          <input
            type="number"
            placeholder="0"
            className={`appearance-none bg-transparent border-0 p-0 text-3xl w-24 focus-visible:ring-0 focus-visible:ring-offset-0 ${workSans.className}`}
          />
        </div>
        <div className="space-y-2 text-right">
          <div className="text-sm flex flex-row justify-between">
            <span className="text-[#aeb3b6]">0 ETH</span>
            <Button
              variant="link"
              className="text-[#39db83] p-0 h-auto font-normal"
            >
              MAX
            </Button>
          </div>
          <Button
            variant="outline"
            className="bg-transparent border-[#242626] hover:bg-[#242626] hover:text-white"
          >
            <EthereumIcon className="mr-2 h-4 w-4" />
            ETH
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Buysell;
