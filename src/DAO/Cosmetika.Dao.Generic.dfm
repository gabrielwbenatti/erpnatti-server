object DmGeneric: TDmGeneric
  OldCreateOrder = True
  Height = 298
  Width = 347
  object FDConnection: TFDConnection
    Params.Strings = (
      'Database=cosmetikadb'
      'User_Name=postgres'
      'Password=postgres'
      'CharacterSet=UTF8'
      'DriverID=PG')
    LoginPrompt = False
    Transaction = FDTransaction
    Left = 80
    Top = 50
  end
  object FDTransaction: TFDTransaction
    Connection = FDConnection
    Left = 92
    Top = 160
  end
  object FDQuery: TFDQuery
    Connection = FDConnection
    Transaction = FDTransaction
    FormatOptions.AssignedValues = [fvSE2Null, fvStrsTrim2Len]
    FormatOptions.StrsEmpty2Null = True
    FormatOptions.StrsTrim2Len = True
    Left = 50
    Top = 156
  end
  object FDPhysPgDriverLink1: TFDPhysPgDriverLink
    VendorLib = 
      'D:\gabri\Documents\GitHub\gabrielwbenatti\cosmetika-server\Win64' +
      '\Debug\libpq.dll'
    Left = 144
    Top = 48
  end
end
