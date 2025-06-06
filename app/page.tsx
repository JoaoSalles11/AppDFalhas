"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  AlertCircle,
  Settings,
  FileText,
  Download,
  ArrowLeft,
  Minimize2,
  X,
  User,
  LogOut,
  BarChart3,
  Info,
  Package,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

interface UserSession {
  registration: string
  operatorName: string
  shift: string
  loginTime: string
}

interface FaultRecord {
  id: string
  date: string
  time: string
  fault: string
  downtime: string
  manualBoxes: "SIM" | "NÃO" | ""
  robotNumber: string
  cuba: string
  product: string
  observations: string
  operatorRegistration: string
  operatorName: string
  shift: string
  recordTime: string
}

export default function FaultControlSystem() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [records, setRecords] = useState<FaultRecord[]>([])
  const [showDeveloperInfo, setShowDeveloperInfo] = useState(false)
  const [loginData, setLoginData] = useState({
    registration: "",
    operatorName: "",
    shift: "",
  })
  const [formData, setFormData] = useState<
    Omit<FaultRecord, "id" | "operatorRegistration" | "operatorName" | "shift" | "recordTime">
  >({
    date: new Date().toLocaleDateString("pt-BR"),
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    fault: "",
    downtime: "",
    manualBoxes: "",
    robotNumber: "",
    cuba: "",
    product: "",
    observations: "",
  })

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setFormData((prev) => ({
        ...prev,
        date: now.toLocaleDateString("pt-BR"),
        time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      }))
    }

    // Update immediately
    updateDateTime()

    // Update every minute
    const interval = setInterval(updateDateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const shifts = ["1º TURNO (05:50 - 14:35)", "2º TURNO (14:03 - 22:42)", "3º TURNO (22:17 - 06:13)"]

  const faultTypes = [
    "1 – DISPOSIÇÃO INCORRETA NO PALLET",
    "2 – LIMPEZA",
    "3 – CAIXA NÃO ABRIU APÓS CORTE",
    "4 – GARRA LEU ERRADO E BATEU NA CAIXA",
    "5 – CAIXA MAL SELADA NA PARTE INFERIOR",
    "6 – CAIXA DEFORMADA (PESO)",
    "7 – CAIXA CAIU APÓS CHACOALHAR OS BOMBONS",
    "8 – CAIXAS NÃO UNIFORMES NA LATERAL",
    "0 – OUTRO (ESPECIFIQUE NAS OBSERVAÇÕES)",
  ]

  const robotNumbers = ["ROBOT 01", "ROBOT 02", "ROBOT 03", "ROBOT 04"]

  const cubas = [
    "CUBA 01",
    "CUBA 02",
    "CUBA 03",
    "CUBA 04",
    "CUBA 05",
    "CUBA 06",
    "CUBA 07",
    "CUBA 08",
    "CUBA 09",
    "CUBA 10",
    "CUBA 11",
    "CUBA 12",
    "CUBA 13",
    "CUBA 14",
  ]

  const products = [
    "OURO BRANCO",
    "LACTA AO LEITE",
    "LAKA",
    "SONHO DE VALSA",
    "5 STAR",
    "BIS AO LEITE",
    "BIS BRANCO",
    "DUONUTS",
    "MORANGO",
    "DIAMANTE NEGRO",
    "AMANDITA",
    "SHOT",
    "STICK",
  ]

  const handleLogin = () => {
    if (!loginData.registration || !loginData.operatorName || !loginData.shift) {
      alert("Por favor, preencha todos os campos.")
      return
    }

    const session: UserSession = {
      registration: loginData.registration.toUpperCase(),
      operatorName: loginData.operatorName.toUpperCase(),
      shift: loginData.shift,
      loginTime: new Date().toLocaleString("pt-BR"),
    }

    setUserSession(session)
  }

  const handleLogout = () => {
    setUserSession(null)
    setLoginData({
      registration: "",
      operatorName: "",
      shift: "",
    })
  }

  const handleInputChange = (
    field: keyof Omit<FaultRecord, "id" | "operatorRegistration" | "operatorName" | "shift" | "recordTime">,
    value: string,
  ) => {
    // Convert text fields to uppercase
    if (field === "observations") {
      value = value.toUpperCase()
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleLoginInputChange = (field: keyof typeof loginData, value: string) => {
    // Convert text fields to uppercase
    if (field === "registration" || field === "operatorName") {
      value = value.toUpperCase()
    }

    setLoginData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getRecommendedSolution = (faultType: string) => {
    const solutions: Record<string, string> = {
      "1 – DISPOSIÇÃO INCORRETA NO PALLET": "REALINHAR PADRÃO DE PALETIZAÇÃO E FAZER NOVA BUSCA COM O ROBÔ.",
      "2 – LIMPEZA":
        "REALIZAR LIMPEZA COMPLETA DO SISTEMA. VERIFICAR SENSORES, LENTES DE CÂMERAS E SUPERFÍCIES DE CONTATO. SEGUIR PROCEDIMENTO DE HIGIENIZAÇÃO PADRÃO.",
      "3 – CAIXA NÃO ABRIU APÓS CORTE":
        "VERIFICAR SISTEMA DE CORTE E ABERTURA DE CAIXAS E AJUSTAR PRESSÃO E TIMING DO MECANISMO DE ABERTURA. INSPECIONAR LÂMINAS DE CORTE.",
      "4 – GARRA DO ROBO LEU ERRADO E BATEU NA CAIXA":
        "CALIBRAR SISTEMA DE VISÃO DA GARRA E VERIFICAR ILUMINAÇÃO E POSICIONAMENTO DAS CÂMERAS. AJUSTAR ALGORITMO DE DETECÇÃO DE POSIÇÃO.",
      "5 – CAIXA MAL SELADA NA PARTE INFERIOR":
        "VERIFICAR SELAGEM DA CAIXA E OBSERVAR SE EXISTEM DEMAIS EXEMPLARES ASSIM E FAZER A CORREÇÃO NECESSÁRIA.",
      "6 – CAIXA DEFORMADA (PESO)":
        "VERIFICAR SE AS DEMAIS CAIXAS ESTÃO COM PESO ALÉM DO MÁXIMO SUPORTADO PELO ROBÔ. AJUSTAR FORÇA DE MANIPULAÇÃO (CAIXA LEVE & CAIXA PESADA).",
      "7 – CAIXA CAIU APÓS CHACOALHAR OS BOMBONS":
        "VERIFICAR SE EXISTE ALGUMA OBSTRUÇÃO NO SISTEMA DE VÁCUO (FITA ADESIVA OU SUJIDADE). AJUSTAR VELOCIDADE DE MOVIMENTAÇÃO SE NECESSÁRIO.",
      "8 – CAIXAS NÃO UNIFORMES NA LATERAL":
        "VERIFICAR ALINHAMENTO DAS DEMAIS CAIXAS, REALIZAR TROCA DE PALLET CASO NECESSÁRIO. INSPECIONAR QUALIDADE DO PAPELÃO (UMIDADE).",
      "0 – OUTRO (ESPECIFIQUE NAS OBSERVAÇÕES)":
        "USE AS OBSERVAÇÕES PARA DETALHES ESPECÍFICOS DO PROBLEMA. REALIZE DIAGNÓSTICO DETALHADO CONFORME PROCEDIMENTO PADRÃO.",
    }

    return (
      solutions[faultType] ||
      "CONSULTE O MANUAL TÉCNICO E ENTRE EM CONTATO COM A EQUIPE DE MANUTENÇÃO PARA DIAGNÓSTICO DETALHADO."
    )
  }

  const validateForm = () => {
    const missingFields: string[] = []

    if (!formData.date.trim()) missingFields.push("Data")
    if (!formData.time.trim()) missingFields.push("Horário")
    if (!formData.fault.trim()) missingFields.push("Falha")
    if (!formData.downtime.trim()) missingFields.push("Tempo Parado")
    if (!formData.manualBoxes.trim()) missingFields.push("Carregou Caixas Manual")
    if (!formData.robotNumber.trim()) missingFields.push("Numero Robo")
    if (!formData.cuba.trim()) missingFields.push("Cuba")
    if (!formData.product.trim()) missingFields.push("Produto")

    return missingFields
  }

  const isFormValid = () => {
    return validateForm().length === 0
  }

  const handleAddRecord = () => {
    const missingFields = validateForm()

    if (missingFields.length > 0) {
      const fieldList = missingFields.join(", ")
      alert(`Por favor, preencha os seguintes campos obrigatórios:\n\n${fieldList}`)
      return
    }

    if (!userSession) {
      alert("Erro: Sessão de usuário não encontrada.")
      return
    }

    const newRecord: FaultRecord = {
      id: Date.now().toString(),
      ...formData,
      observations: formData.observations.toUpperCase(),
      operatorRegistration: userSession.registration,
      operatorName: userSession.operatorName,
      shift: userSession.shift,
      recordTime: new Date().toLocaleString("pt-BR"),
    }

    setRecords((prev) => [...prev, newRecord])

    // Reset form
    const now = new Date()
    setFormData({
      date: now.toLocaleDateString("pt-BR"),
      time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      fault: "",
      downtime: "",
      manualBoxes: "",
      robotNumber: "",
      cuba: "",
      product: "",
      observations: "",
    })

    alert("Registro adicionado com sucesso!")
  }

  const handleExport = () => {
    if (records.length === 0) {
      alert("Nenhum registro para exportar.")
      return
    }

    const csvContent = [
      "Data,Horário,Falha,Tempo Parado (min),Carregou Caixas Manual,Numero Robo,Cuba,Produto,Observações,Matrícula Operador,Nome Operador,Turno,Hora do Registro",
      ...records.map(
        (record) =>
          `${record.date},${record.time},"${record.fault}",${record.downtime},${record.manualBoxes},${record.robotNumber},"${record.cuba}","${record.product}","${record.observations}",${record.operatorRegistration},"${record.operatorName}","${record.shift}",${record.recordTime}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `controle_falhas_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePowerBIIntegration = () => {
    if (records.length === 0) {
      alert("Nenhum dado disponível para análise no Power BI.")
      return
    }

    // Create JSON data for Power BI
    const powerBIData = {
      metadata: {
        exportDate: new Date().toISOString(),
        totalRecords: records.length,
        exportedBy: userSession?.operatorName || "Sistema",
      },
      data: records.map((record) => ({
        Date: record.date,
        Time: record.time,
        FaultType: record.fault,
        DowntimeMinutes: Number.parseInt(record.downtime),
        ManualBoxLoading: record.manualBoxes,
        RobotNumber: record.robotNumber,
        Cuba: record.cuba,
        Product: record.product,
        Observations: record.observations,
        OperatorRegistration: record.operatorRegistration,
        OperatorName: record.operatorName,
        Shift: record.shift,
        RecordTime: record.recordTime,
      })),
    }

    // Create JSON file for Power BI import
    const jsonContent = JSON.stringify(powerBIData, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `powerbi_data_${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show instructions for Power BI
    alert(
      "Dados exportados para Power BI!\n\n" +
        "Instruções:\n" +
        "1. Abra o Power BI Desktop\n" +
        "2. Clique em 'Obter Dados' > 'JSON'\n" +
        "3. Selecione o arquivo JSON baixado\n" +
        "4. Configure suas visualizações\n\n" +
        "O arquivo contém todos os dados de falhas com metadados para análise completa.",
    )
  }

  // Login Screen
  if (!userSession) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white p-6 -m-6 mb-6 rounded-t-lg">
              <div className="flex justify-center mb-4">
                <Image
                  src="/mondelez-logo.png"
                  alt="Mondelez International"
                  width={120}
                  height={40}
                  className="object-contain"
                />
              </div>
              <h2 className="text-lg font-semibold">Controle de Falhas</h2>
            </div>
            <CardTitle className="text-xl">Identificação do Operador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registration">Matrícula</Label>
              <Input
                id="registration"
                type="text"
                value={loginData.registration}
                onChange={(e) => handleLoginInputChange("registration", e.target.value)}
                placeholder="Digite sua matrícula"
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatorName">Nome do Operador</Label>
              <Input
                id="operatorName"
                type="text"
                value={loginData.operatorName}
                onChange={(e) => handleLoginInputChange("operatorName", e.target.value)}
                placeholder="Digite seu nome completo"
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shift">Turno</Label>
              <Select value={loginData.shift} onValueChange={(value) => handleLoginInputChange("shift", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu turno" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift} value={shift}>
                      {shift}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
            >
              Iniciar Sessão
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Application
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-purple-600">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Controle de Falhas - Mondelez</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{userSession.operatorName}</span>
              </div>
              <div>Matrícula: {userSession.registration}</div>
              <div>{userSession.shift}</div>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-purple-600" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-purple-600">
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-purple-600">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <h2 className="text-2xl font-bold">Controle de Falhas</h2>
          <div className="flex justify-center">
            <Image
              src="/mondelez-logo.png"
              alt="Mondelez International"
              width={100}
              height={35}
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados da Falha */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Dados da Falha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Data e Horário em linha */}
            <div className="grid grid-cols-2 gap-4">
              {/* Data */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Data *
                </Label>
                <Input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  placeholder="DD/MM/AAAA"
                />
              </div>

              {/* Horário */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Horário *
                </Label>
                <Input
                  type="text"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  placeholder="HH:MM"
                />
              </div>
            </div>

            {/* Falha */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                Falha *
              </Label>
              <Select value={formData.fault} onValueChange={(value) => handleInputChange("fault", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de falha" />
                </SelectTrigger>
                <SelectContent>
                  {faultTypes.map((fault) => (
                    <SelectItem key={fault} value={fault}>
                      {fault}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tempo Parado */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4" />
                Tempo Parado (min) *
              </Label>
              <Input
                type="number"
                value={formData.downtime}
                onChange={(e) => handleInputChange("downtime", e.target.value)}
                placeholder="Tempo em minutos"
              />
            </div>

            {/* Carregou Caixas Manual */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Settings className="w-4 h-4" />
                Carregou Caixas Manual? *
              </Label>
              <RadioGroup
                value={formData.manualBoxes}
                onValueChange={(value) => handleInputChange("manualBoxes", value as "SIM" | "NÃO")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SIM" id="sim" />
                  <Label htmlFor="sim">SIM</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="NÃO" id="nao" />
                  <Label htmlFor="nao">NÃO</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Numero Robo */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Settings className="w-4 h-4" />
                Numero Robo *
              </Label>
              <Select value={formData.robotNumber} onValueChange={(value) => handleInputChange("robotNumber", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o robô" />
                </SelectTrigger>
                <SelectContent>
                  {robotNumbers.map((robot) => (
                    <SelectItem key={robot} value={robot}>
                      {robot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cuba */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Cuba *
              </Label>
              <Select value={formData.cuba} onValueChange={(value) => handleInputChange("cuba", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cuba onde ocorreu o defeito" />
                </SelectTrigger>
                <SelectContent>
                  {cubas.map((cuba) => (
                    <SelectItem key={cuba} value={cuba}>
                      {cuba}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Produto */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Package className="w-4 h-4" />
                Produto *
              </Label>
              <Select value={formData.product} onValueChange={(value) => handleInputChange("product", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o produto que estava rodando" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4" />
                Observações
              </Label>
              <Textarea
                value={formData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                placeholder="Descreva detalhes adicionais sobre a falha..."
                rows={3}
                className="uppercase"
              />
            </div>

            {!isFormValid() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 font-medium">
                  ⚠️ Preencha todos os campos obrigatórios (marcados com *) para adicionar o registro
                </p>
              </div>
            )}

            {/* Adicionar Registro Button */}
            <Button
              onClick={handleAddRecord}
              disabled={!isFormValid()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Adicionar Registro
            </Button>
          </CardContent>
        </Card>

        {/* Solução Recomendada */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Solução Recomendada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[300px]">
              <p className="text-sm text-gray-700 leading-relaxed">
                {formData.fault
                  ? getRecommendedSolution(formData.fault)
                  : "Selecione um tipo de falha para ver a solução recomendada."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export and Power BI Buttons */}
      <div className="px-6 pb-6 flex gap-4">
        <Button
          onClick={handleExport}
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-8 py-2"
          disabled={records.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Excel/CSV
        </Button>

        <Button
          onClick={handlePowerBIIntegration}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-2"
          disabled={records.length === 0}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Integrar Power BI
        </Button>

        {records.length > 0 && (
          <p className="text-sm text-gray-600 mt-2 self-center">
            {records.length} registro(s) disponível(is) para exportação
          </p>
        )}
      </div>

      {/* Footer with Developer Info */}
      <div className="bg-purple-700 text-white text-center py-3 relative">
        <p className="text-sm">Mondelez International 2025 - Todos os direitos reservados ©</p>

        {/* Discreet Developer Info Button */}
        <Dialog open={showDeveloperInfo} onOpenChange={setShowDeveloperInfo}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-2 text-white/50 hover:text-white/80 hover:bg-purple-600/50 p-1 h-6 w-6"
            >
              <Info className="w-3 h-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Informações do Desenvolvedor</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4 py-4">
              <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Sistema de Controle de Falhas</h3>
                <div className="flex justify-center mb-2">
                  <Image
                    src="/mondelez-logo.png"
                    alt="Mondelez International"
                    width={80}
                    height={25}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Desenvolvido por:</p>
                <h4 className="text-lg font-bold text-purple-700">JOÃO VITOR SALES SILVA</h4>
                <p className="text-xs text-gray-500">Desenvolvedor em Processo de Aprendizado</p>
                <p className="text-xs text-gray-500">Colaborador Mondelez</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-gray-400">
                  Sistema desenvolvido para otimização do controle de falhas em linhas de produção automatizadas
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
