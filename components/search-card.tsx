"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export function SearchCard() {
  const router = useRouter()
  const [plate, setPlate] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidPlate = plate.length === 7
  const canSubmit = isValidPlate && acceptedTerms && acceptedPrivacy && !isLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!acceptedTerms || !acceptedPrivacy) {
      setError("Por favor, aceite os termos e a política de privacidade.")
      return
    }
    if (!isValidPlate) {
      setError("Por favor, digite uma placa válida (7 caracteres).")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/consultar-placa?placa=${plate}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Placa não encontrada. Por favor, verifique e tente novamente.")
        setIsLoading(false)
        return
      }

      sessionStorage.setItem("vehicleData", JSON.stringify(data))
      router.push(`/debitos?placa=${plate}`)
    } catch (error) {
      console.error("Erro ao consultar placa:", error)
      setError("Erro ao consultar placa. Por favor, verifique se a placa está correta e tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 pb-6 md:pb-20">
      <Card className="bg-gray-100 border-border p-5 md:p-8 lg:p-10 max-w-2xl">
        <h2 className="text-lg md:text-3xl font-bold mb-4 md:mb-6 leading-tight text-balance text-gray-900">
          Um <span className="font-extrabold">único</span> lugar para <span className="font-extrabold">acessar</span> e{" "}
          <span className="font-extrabold">controlar</span> seus pagamentos.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <Input
              type="text"
              placeholder="DIGITE SUA PLACA"
              value={plate}
              onChange={(e) => {
                setPlate(e.target.value.toUpperCase())
                setError("") // Clear error when user types
              }}
              className="w-full h-12 md:h-14 text-base md:text-lg bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
              maxLength={7}
              disabled={isLoading}
            />
            {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="flex items-start gap-2 md:gap-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                className="mt-0.5 w-5 h-5 md:w-6 md:h-6"
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-xs md:text-sm leading-relaxed cursor-pointer text-gray-900">
                Aceito os{" "}
                <a href="#" className="underline hover:text-primary transition-colors">
                  Termos e Condições de Uso
                </a>
                .
              </label>
            </div>

            <div className="flex items-start gap-2 md:gap-3">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                className="mt-0.5 w-5 h-5 md:w-6 md:h-6"
                disabled={isLoading}
              />
              <label htmlFor="privacy" className="text-xs md:text-sm leading-relaxed cursor-pointer text-gray-900">
                Estou ciente da{" "}
                <a href="#" className="underline hover:text-primary transition-colors">
                  Política de Privacidade
                </a>{" "}
                e me responsabilizo pela veracidade dos dados.
              </label>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            className={`w-full h-11 md:h-12 text-sm md:text-base font-semibold transition-colors ${
              canSubmit
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-gray-400 text-gray-700 cursor-not-allowed hover:bg-gray-400"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando...
              </>
            ) : (
              "Buscar débitos"
            )}
          </Button>

          <div className="text-center">
            <a href="#" className="text-sm text-gray-900 underline hover:text-primary transition-colors">
              Começar agora
            </a>
          </div>
        </form>
      </Card>
    </section>
  )
}
