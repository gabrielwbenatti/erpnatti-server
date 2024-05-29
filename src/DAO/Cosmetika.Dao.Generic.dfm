object DmGeneric: TDmGeneric
  Height = 371
  Width = 519
  PixelsPerInch = 120
  object FDConnection: TFDConnection
    Params.Strings = (
      'Database=D:\projetos\Cosmetika\Database\COSMETIKA.FDB'
      'User_Name=SYSDBA'
      'Password=masterkey'
      'Port=3050'
      'CharacterSet=UTF8'
      'DriverID=FB')
    LoginPrompt = False
    Transaction = FDTransaction
    Left = 80
    Top = 50
  end
  object FDTransaction: TFDTransaction
    Connection = FDConnection
    Left = 220
    Top = 40
  end
  object FDQuery: TFDQuery
    Connection = FDConnection
    Transaction = FDTransaction
    FormatOptions.AssignedValues = [fvSE2Null, fvStrsTrim2Len]
    FormatOptions.StrsEmpty2Null = True
    FormatOptions.StrsTrim2Len = True
    Left = 90
    Top = 220
  end
end
