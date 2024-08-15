unit Cosmetika.Model.PurchaseInvoice;

interface

uses
  Cosmetika.Model.Thirdy, System.JSON, System.Generics.Collections,
  Cosmetika.Model.PurchInvDet;

type
  TPurchaseInvoice = class
  private
    FRowId: Integer;
    FSupplier: TThirdy;
    FEntryDate: TDate;
    FIssuanceDate: TDate;
    FTotalAmount: Double;
    FDet: TPurchInvDetCollection;
  public
    constructor Create;
    destructor Destroy; override;
    class function FromJSON(JSON: TJSONObject): TPurchaseInvoice;
    function ToJSON: TJSONObject;
  published
    property RowId: Integer read FRowId write FRowId;
    property Supplier: TThirdy read FSupplier write FSupplier;
    property IssuanceDate: TDate read FIssuanceDate write FIssuanceDate;
    property EntryDate: TDate read FEntryDate write FEntryDate;
    property TotalAmount: Double read FTotalAmount write FTotalAmount;
    property Det: TPurchInvDetCollection read FDet write FDet;
  end;

implementation

uses
  Cosmetika.Utils, Cosmetika.Dao.Thirdy;

{ TPurchaseInvoice }

constructor TPurchaseInvoice.Create;
begin
  inherited Create;
  FDet := TPurchInvDetCollection.Create;
end;

destructor TPurchaseInvoice.Destroy;
begin
  FDet.Free;
  inherited;
end;

class function TPurchaseInvoice.FromJSON(JSON: TJSONObject): TPurchaseInvoice;
var
  I: Integer;
  ThirdyDao: TDmThirdy;
  DetJson: TJSONArray;
begin
  Result := TPurchaseInvoice.Create;
  ThirdyDao := TDmThirdy.Create;

  try
    Result.Supplier := ThirdyDao.GetBy('rowid',
      JSON.GetValue<Integer>('fkSupplierId'));

    Result.IssuanceDate :=
      JSONToDate(JSON.GetValue<string>('issuanceDate', ''));

    Result.EntryDate := JSONToDate(JSON.GetValue<string>('entryDate', ''));
    Result.TotalAmount := JSON.GetValue<Double>('totalAmount', 0);

    DetJson := JSON.GetValue<TJSONArray>('det', TJSONArray.Create());

    for I := 0 to Pred(DetJson.Count) do
    begin
      Result.Det.Add(TPurchInvDet.FromJSON(TJSONObject(DetJson.Items[I])));
    end;
  finally
    ThirdyDao.Free;
    DetJson.Free;
  end;
end;

function TPurchaseInvoice.ToJSON: TJSONObject;
begin
  Result := TJSONObject.Create;

  Result.AddPair('rowid', TJSONNumber.Create(FRowId));
  Result.AddPair('supplier', FSupplier.ToJSON);
  Result.AddPair('issuanceDate', TJSONString.Create(DateToJSON(FIssuanceDate)));
  Result.AddPair('entryDate', TJSONString.Create(DateToJSON(FEntryDate)));
  Result.AddPair('totalAmount', TJSONNumber.Create(FTotalAmount));
  Result.AddPair('det', TJSONArray.Create(FDet.ToJSON));
end;

end.
