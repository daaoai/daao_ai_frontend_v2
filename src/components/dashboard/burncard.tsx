import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function BurnCard() {
  return (
    <Card className="text-left w-full max-w-3xl bg-[#0d0d0d] border-[#383838] text-white font-['Work Sans']">
      <CardHeader className="space-y-9">
        <div className="flex items-center gap-3">
          <span className="text-[#409cff] text-2xl sm:text-3xl font-semibold">$DWL</span>
          <h2 className="text-2xl sm:text-3xl font-semibold">Burn</h2>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-black rounded border border-[#383838]">
            <Input
              type="number"
              placeholder="0"
              className="appearance-none bg-transparent border-none text-[#e4e6e7] text-lg sm:text-xl font-medium w-full focus:outline-none"
            />
            <span className="text-[#e4e6e7] text-sm sm:text-base font-medium">MAX</span>
          </div>
          <div className="space-y-3">
            <label className="text-base sm:text-lg">Balance</label>
            <Button variant="outline" className="w-full h-12 bg-white text-black text-lg sm:text-xl font-semibold hover:bg-[#409cff]/50">
              Burn
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator className="bg-[#383838]" />
      <CardContent className="space-y-8 mt-8">
        <div className="space-y-4">
          <h3 className="text-[#409cff] text-xl sm:text-2xl font-semibold">About Token</h3>
          <p className="text-base sm:text-lg">
            Corem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {['How to Earn', 'Whitelist Mechanics'].map((title) => (
            <div key={title} className="space-y-4">
              <h4 className="text-[#409cff] text-base sm:text-lg font-semibold">{title}</h4>
              <ul className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="text-sm sm:text-base">
                    - Yorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-sm sm:text-base">
          Porem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </CardContent>
    </Card>
  )
}

