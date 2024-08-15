unit Cosmetika.Dao.Thirdy;

interface

uses
  System.SysUtils, System.Classes, Cosmetika.Dao.Generic, FireDAC.Stan.Intf,
  FireDAC.Stan.Option, FireDAC.Stan.Error, FireDAC.UI.Intf, FireDAC.Phys.Intf,
  FireDAC.Stan.Def, FireDAC.Stan.Pool, FireDAC.Stan.Async, FireDAC.Phys,
  FireDAC.Phys.FB, FireDAC.Phys.FBDef, FireDAC.ConsoleUI.Wait,
  FireDAC.Stan.Param, FireDAC.DatS, FireDAC.DApt.Intf, FireDAC.DApt, Data.DB,
  FireDAC.Comp.DataSet, FireDAC.Comp.Client, System.JSON,
  System.Generics.Collections, FireDAC.VCLUI.Wait,
  Cosmetika.Model.Thirdy, FireDAC.Phys.PG, FireDAC.Phys.PGDef;

type
  TDmThirdy = class(TDmGeneric)
  private
    { Private declarations }
  public
    { Public declarations }
    function Destroy(Params: TDictionary<string, string>): Boolean;
    function GetBy(FieldName: string; Value: Variant): TThirdy;
    function Index(Query: TDictionary<string, string>): TJSONArray;
    function Show(Params: TDictionary<string, string>): TJSONObject;
    function Store(JSON: TJSONObject): Boolean;
  end;

var
  DmThirdy: TDmThirdy;

implementation

uses
  Cosmetika.Utils;

{%CLASSGROUP 'System.Classes.TPersistent'}
{$R *.dfm}
{ TDmThirdy }

function TDmThirdy.Destroy(Params: TDictionary<string, string>): Boolean;
begin

end;

function TDmThirdy.GetBy(FieldName: string; Value: Variant): TThirdy;
begin
  Result := nil;

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from THIRDIES ');
    SQL.Add(' where ' + FieldName + ' = :FIELD_PARAM ');
    ParamByName('FIELD_PARAM').Value := Value;
    Open();
  end;

  if not FDQuery.IsEmpty then
  begin
    Result := TThirdy.Create;

    Result.RowId := FDQuery.FieldByName('ROWID').AsInteger;
    Result.Name := FDQuery.FieldByName('NAME').AsString;
    Result.NameAlias := FDQuery.FieldByName('NAME_ALIAS').AsString;
    Result.Document := FDQuery.FieldByName('DOCUMENT').AsString;
    Result.IsSupplier := FDQuery.FieldByName('IS_SUPPLIER').AsBoolean;
  end;

  FDQuery.Transaction.Commit;
end;

function TDmThirdy.Index(Query: TDictionary<string, string>): TJSONArray;
var
  Thirdy: TThirdy;
  IsSupplier: string;
begin
  Result := TJSONArray.Create;

  Query.TryGetValue('isSupplier', IsSupplier);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add(' select * from THIRDIES ');

    if not IsSupplier.Trim.IsEmpty then
    begin
      SQL.Add(' where ');
      SQL.Add('     (IS_SUPPLIER = :IS_SUPPLIER) ');
      ParamByName('IS_SUPPLIER').AsString := IsSupplier;
    end;

    Open();
  end;

  if not FDQuery.IsEmpty then
  begin
    FDQuery.FetchAll;
    FDQuery.First;
    while not FDQuery.Eof do
    begin
      Thirdy := TThirdy.Create;
      try
        Thirdy.RowId := FDQuery.FieldByName('ROWID').AsInteger;
        Thirdy.Name := FDQuery.FieldByName('NAME').AsString;
        Thirdy.NameAlias := FDQuery.FieldByName('NAME_ALIAS').AsString;
        Thirdy.Document := FDQuery.FieldByName('DOCUMENT').AsString;

        Result.Add(Thirdy.ToJSON);
      finally
        Thirdy.Free;
      end;
      FDQuery.Next;
    end;
  end;

  FDQuery.Transaction.Commit;
end;

function TDmThirdy.Show(Params: TDictionary<string, string>): TJSONObject;
var
  Id: string;
  Thirdy: TThirdy;
begin
  Result := nil;
  Params.TryGetValue('id', Id);
  Thirdy := Self.GetBy('rowid', StrToInt(Id));

  if Assigned(Thirdy) then
    Result := Thirdy.ToJSON;
end;

function TDmThirdy.Store(JSON: TJSONObject): Boolean;
var
  Thirdy: TThirdy;
begin
  Thirdy := TThirdy.FromJSON(JSON);

  with FDQuery do
  begin
    if not Transaction.Active then
      Transaction.StartTransaction;

    Close;
    SQL.Clear;
    SQL.Add('insert into ');
    SQL.Add('    THIRDIES ( ');
    SQL.Add('        NAME, ');
    SQL.Add('        DOCUMENT, ');
    SQL.Add('        IS_SUPPLIER ');
    SQL.Add('    ) ');
    SQL.Add('values');
    SQL.Add('   (');
    SQL.Add('        :NAME, ');
    SQL.Add('        :DOCUMENT, ');
    SQL.Add('        :IS_SUPPLIER ');
    SQL.Add('    )');

    ParamByName('NAME').AsString := Thirdy.Name;
    ParamByName('DOCUMENT').AsString := NumbersOnly(Thirdy.Document);
    ParamByName('IS_SUPPLIER').AsBoolean := Thirdy.IsSupplier;

    ExecSQL;
  end;

  Result := (FDQuery.RowsAffected > 0);

  FDQuery.Transaction.Commit;
end;

end.
