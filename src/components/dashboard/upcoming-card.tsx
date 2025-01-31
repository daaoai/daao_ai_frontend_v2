import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Clock, Globe } from 'lucide-react'
import { TelegramIcon, XIcon } from "@/assets/icons/social"
import { useState,useEffect } from "react"
import { getContractData } from "../../getterFunctions";
import { set } from "date-fns"


export default function UpcomingFunds(props: UpcomingFundDetailsProps) {
  const [endFTime, setEndFTime] = useState("");

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const data = await getContractData();
        setEndFTime(data.endDate);
        console.log("Data is ", data)
      } catch (error) {
        console.error("Error fetching contract data:", error);
      }
    };

    fetchContractData();
  }, []);


  return (
    <Card className="w-full max-w-3xl bg-[#0d0d0d] border-[#383838] text-white font-['Work Sans'] h-min">
      <CardHeader className="space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold">Heading</h2>
          <Badge variant="secondary" className="text-[#409cff] text-base sm:text-lg lg:text-2xl font-semibold">
            ${props.shortname}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm sm:text-base lg:text-lg">
          <div className="flex items-center gap-1.5">
            <Link href={props.twitter} className="flex items-center gap-1.5">
              <XIcon />
              <span>@username</span>
            </Link>
          </div>
          <Link href={props.telegram} className="flex items-center gap-1.5">
            <TelegramIcon />
            <span>telegram</span>
          </Link>
          <Link href={props.telegram} className="flex items-center gap-1.5 text-[#92c5fd]">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Website</span>
          </Link>
        </div>
      </CardHeader>
      <Separator className="bg-[#383838]" />
      <CardContent className="mt-4 sm:mt-6 lg:mt-7 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 lg:w-[100px] lg:h-[100px]">
            <AvatarImage src={props.logo} />
            <AvatarFallback>Logo</AvatarFallback>
          </Avatar>
          <p className="text-left text-base sm:text-lg lg:text-xl flex-1">
            {props.description}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {['Start Date', 'End Date'].map((label, index) => (
            <div key={label} className="space-y-2 sm:space-y-3">
              <label className="text-sm sm:text-base lg:text-lg">{label}</label>
              <div className="px-2 py-2 sm:py-3 bg-[#121212] rounded border border-[#383838] text-[#aeb3b6] text-xs sm:text-sm">
                <Clock className="inline-block w-4 h-4 mr-2" />
                {index === 0 ? '0 days, 11 hours, 5 minutes, 20 seconds' : endFTime}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center text-sm sm:text-base lg:text-lg">
            <span>Funding Progress</span>
            <span>{props.fundingProgress}%</span>
          </div>
          <Progress value={props.fundingProgress} className="h-4 sm:h-5 [&>div]:bg-[#409cff] bg-[#2b4977]" />
        </div>
      </CardContent>
    </Card >
  )
}

