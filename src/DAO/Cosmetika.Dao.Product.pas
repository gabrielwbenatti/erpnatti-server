unit Cosmetika.Dao.Product;

interface

uses
  System.SysUtils, System.Classes, Cosmetika.Dao.Generic, FireDAC.Stan.Intf,
  FireDAC.Stan.Option, FireDAC.Stan.Error, FireDAC.UI.Intf, FireDAC.Phys.Intf,
  FireDAC.Stan.Def, FireDAC.Stan.Pool, FireDAC.Stan.Async, FireDAC.Phys,
  FireDAC.ConsoleUI.Wait, FireDAC.Stan.Param, FireDAC.DatS, FireDAC.DApt.Intf,
  FireDAC.DApt, Data.DB, FireDAC.Comp.DataSet, FireDAC.Comp.Client,
  FireDAC.Phys.FB, FireDAC.Phys.FBDef, System.JSON, FireDAC.VCLUI.Wait,
  System.Generics.Collections, Cosmetika.Model.Product;

type
  TDmProduct = class(TDmGeneric)
  private
    { Private declarations }
  public
    { Public declarations }
    function Destroy(Params: TDictionary<string, string>): Boolean;
    function GetById(Id: Integer): TProduct;
    function Index(Query: TDictionary<string, string>): TJSONArray;
    function Show(Params: TDictionary<string, string>): TJSONObject;
    function Store(JSON: TJSONObject): Boolean;
  end;

var
  DmProduct: TDmProduct;

implementation

{%CLASSGROUP 'System.Classes.TPersistent'}
{$R *.dfm}
{ TDmProduct }

function TDmProduct.Destroy(Params: TDictionary<string, string>): Boolean;
var
  Id: string;
begin
  Params.TryGetValue('id', Id);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;

    SQL.Add(' delete from PRODUCTS ');
    SQL.Add(' where ROWID = :ROWID ');
    ParamByName('ROWID').AsString := Id;

    ExecSQL;
  end;

  Result := (FDQuery.RowsAffected > 0);

  FDQuery.Transaction.Commit;
end;

function TDmProduct.GetById(Id: Integer): TProduct;
begin
  Result := nil;

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from PRODUCTS ');
    SQL.Add(' where ROWID = :ROWID ');
    ParamByName('ROWID').AsInteger := Id;
    Open();
  end;

  if not FDQuery.IsEmpty then
  begin
    Result := TProduct.Create;

    Result.RowId := FDQuery.FieldByName('ROWID').AsInteger;
    Result.Name := FDQuery.FieldByName('NAME').AsString;
    Result.NameAlias := FDQuery.FieldByName('NAME_ALIAS').AsString;
    Result.Reference := FDQuery.FieldByName('REFERENCE').AsString;
    Result.Status := FDQuery.FieldByName('STATUS').AsBoolean;
    Result.ToSell := FDQuery.FieldByName('TO_SELL').AsBoolean;
    Result.ToBuy := FDQuery.FieldByName('TO_BUY').AsBoolean;
  end;

  FDQuery.Transaction.Commit;
end;

function TDmProduct.Index(Query: TDictionary<string, string>): TJSONArray;
var
  Product: TProduct;
  SearchTerm, Reference: string;
begin
  Result := TJSONArray.Create;

  Query.TryGetValue('searchTerm', SearchTerm);
  Query.TryGetValue('reference', Reference);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from PRODUCTS ');

    if not (Reference.Trim.IsEmpty) then
    begin
      SQL.Add(' where ');
      SQL.Add('     REFERENCE = :REFERENCE ');
      ParamByName('REFERENCE').AsString := Reference;
    end
    else if not (SearchTerm.Trim.IsEmpty) then
    begin
      SQL.Add(' where ');
      SQL.Add('     (NAME containing(:SEARCH_TERM)) or ');
      SQL.Add('     (NAME_ALIAS containing(:SEARCH_TERM)) or ');
      SQL.Add('     (REFERENCE containing(:SEARCH_TERM)) ');
      ParamByName('SEARCH_TERM').AsString := SearchTerm;
    end;

    Open();
  end;

  if not FDQuery.IsEmpty then
  begin
    FDQuery.FetchAll;
    FDQuery.First;
    while not FDQuery.Eof do
    begin
      Product := TProduct.Create;
      try
        Product.RowId := FDQuery.FieldByName('rowid').AsInteger;
        Product.Name := FDQuery.FieldByName('name').AsString;
        Product.NameAlias := FDQuery.FieldByName('name_alias').AsString;
        Product.Reference := FDQuery.FieldByName('reference').AsString;

        Result.Add(Product.ToJSON);
      finally
        Product.Free;
      end;

      FDQuery.Next;
    end;
  end;

  FDQuery.Transaction.Commit;
end;

function TDmProduct.Show(Params: TDictionary<string, string>): TJSONObject;
var
  Id: string;
  Product: TProduct;
begin
  Result := nil;
  Params.TryGetValue('id', Id);
  Product := Self.GetById(StrToInt(Id));

  if Assigned(Product) then
    Result := Product.ToJSON;
end;

function TDmProduct.Store(JSON: TJSONObject): Boolean;
var
  Product: TProduct;
begin
  Product := TProduct.FromJSON(JSON);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add('insert into');
    SQL.Add('    PRODUCTS (');
    SQL.Add('        REFERENCE,');
    SQL.Add('        NAME,');
    SQL.Add('        NAME_ALIAS,');
    SQL.Add('        STATUS,');
    SQL.Add('        TO_SELL,');
    SQL.Add('        TO_BUY');
    SQL.Add('    )');
    SQL.Add('values');
    SQL.Add('    (');
    SQL.Add('        :REFERENCE,');
    SQL.Add('        :NAME,');
    SQL.Add('        :NAME_ALIAS,');
    SQL.Add('        :STATUS,');
    SQL.Add('        :TO_SELL,');
    SQL.Add('        :TO_BUY');
    SQL.Add('    )');

    ParamByName('REFERENCE').AsString := Product.Reference;
    ParamByName('NAME').AsString := Product.Name;
    ParamByName('NAME_ALIAS').AsString := Product.NameAlias;
    ParamByName('STATUS').AsBoolean := Product.Status;
    ParamByName('TO_SELL').AsBoolean := Product.ToSell;
    ParamByName('TO_BUY').AsBoolean := Product.ToBuy;

    ExecSQL;
  end;

  Result := (FDQuery.RowsAffected > 0);

  FDQuery.Transaction.Commit;
end;

end.
