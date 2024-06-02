unit Cosmetika.Dao.PurchaseInvoice;

interface

uses
  System.SysUtils, System.Classes, Cosmetika.Dao.Generic, FireDAC.Stan.Intf,
  FireDAC.Stan.Option, FireDAC.Stan.Error, FireDAC.UI.Intf, FireDAC.Phys.Intf,
  FireDAC.Stan.Def, FireDAC.Stan.Pool, FireDAC.Stan.Async, FireDAC.Phys,
  FireDAC.Phys.FB, FireDAC.Phys.FBDef, FireDAC.ConsoleUI.Wait,
  FireDAC.Stan.Param, FireDAC.DatS, FireDAC.DApt.Intf, FireDAC.DApt, Data.DB,
  FireDAC.Comp.DataSet, FireDAC.Comp.Client, System.JSON, FireDAC.VCLUI.Wait,
  Cosmetika.Model.PurchaseInvoice, System.Generics.Collections,
  Cosmetika.Model.PurchInvDet;

type
  TDmPurchaseInvoice = class(TDmGeneric)
  private
    { Private declarations }
  public
    { Public declarations }
    function GetById(Id: Integer): TPurchaseInvoice;
    function Show(Params: TDictionary<string, string>): TJSONObject;
    function Store(JSON: TJSONObject): Boolean;
  end;

var
  DmPurchaseInvoice: TDmPurchaseInvoice;

implementation

uses
  Cosmetika.Utils, Cosmetika.Dao.Thirdy, Cosmetika.Dao.PurchInvDet;

{%CLASSGROUP 'System.Classes.TPersistent'}
{$R *.dfm}
{ TDmPurchaseInvoice }

function TDmPurchaseInvoice.GetById(Id: Integer): TPurchaseInvoice;
var
  ThirdyDao: TDmThirdy;
  PurchInvDet: TDmPurchInvDet;
begin
  Result := nil;

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from PURCHASE_INVOICE ');
    SQL.Add(' where ROWID = :ROWID ');
    ParamByName('ROWID').AsInteger := Id;
    Open();
  end;

  ThirdyDao := TDmThirdy.Create;
  PurchInvDet := TDmPurchInvDet.Create;
  try
    if not FDQuery.IsEmpty then
    begin
      Result := TPurchaseInvoice.Create;

      Result.RowId := FDQuery.FieldByName('ROWID').AsInteger;
      Result.Supplier := ThirdyDao.GetById(FDQuery.FieldByName('FK_SUPPLIER_ID')
        .AsInteger);
      Result.IssuanceDate := FDQuery.FieldByName('ISSUANCE_DATE').AsDateTime;
      Result.EntryDate := FDQuery.FieldByName('ENTRY_DATE').AsDateTime;
      Result.TotalAmount := FDQuery.FieldByName('TOTAL_AMOUNT').AsFloat;

      Result.Det := PurchInvDet.GetByPurchId(Result.RowId);
    end;
  finally
    ThirdyDao.Free;
    PurchInvDet.Free;
  end;
end;

function TDmPurchaseInvoice.Show(Params: TDictionary<string, string>)
  : TJSONObject;
var
  Invoice: TPurchaseInvoice;
  Id: string;
begin
  Result := nil;
  Params.TryGetValue('id', Id);
  Invoice := Self.GetById(StrToInt(Id));

  if Assigned(Invoice) then
    try
      Result := Invoice.ToJSON;
    finally
      Invoice.Free;
    end;
end;

function TDmPurchaseInvoice.Store(JSON: TJSONObject): Boolean;
var
  Invoice: TPurchaseInvoice;
  InvDetDao: TDmPurchInvDet;
begin
  Invoice := TPurchaseInvoice.FromJSON(JSON);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add('insert into ');
    SQL.Add('    PURCHASE_INVOICE ( ');
    SQL.Add('        FK_SUPPLIER_ID, ');
    SQL.Add('        ISSUANCE_DATE, ');
    SQL.Add('        ENTRY_DATE, ');
    SQL.Add('        TOTAL_AMOUNT ');
    SQL.Add('    ) ');
    SQL.Add('values ');
    SQL.Add('    ( ');
    SQL.Add('        :FK_SUPPLIER_ID, ');
    SQL.Add('        :ISSUANCE_DATE, ');
    SQL.Add('        :ENTRY_DATE, ');
    SQL.Add('        :TOTAL_AMOUNT ');
    SQL.Add('    ) ');
    SQL.Add('returning ROWID ');

    ParamByName('FK_SUPPLIER_ID').AsInteger := Invoice.Supplier.RowId;
    ParamByName('ISSUANCE_DATE').AsString := DateToJSON(Invoice.IssuanceDate);
    ParamByName('ENTRY_DATE').AsString := DateToJSON(Invoice.EntryDate);
    ParamByName('TOTAL_AMOUNT').AsFloat := Invoice.TotalAmount;

    Open();
  end;

  Invoice.RowId := FDQuery.FieldByName('ROWID').AsInteger;

  Result := (FDQuery.RowsAffected > 0);
  FDQuery.Transaction.Commit;

  InvDetDao := TDmPurchInvDet.Create;
  try
     InvDetDao.Store(Invoice.Det, Invoice.RowId);
  finally
    InvDetDao.Free;
  end;
end;

end.
