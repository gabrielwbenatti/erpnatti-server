unit Cosmetika.Dao.Generic;

interface

uses
  System.SysUtils, System.Classes, FireDAC.Stan.Intf, FireDAC.Stan.Option,
  FireDAC.Stan.Error, FireDAC.UI.Intf, FireDAC.Phys.Intf, FireDAC.Stan.Def,
  FireDAC.Stan.Pool, FireDAC.Stan.Async, FireDAC.Phys, FireDAC.ConsoleUI.Wait,
  FireDAC.Comp.Client, Data.DB, FireDAC.Stan.Param, FireDAC.DatS,
  FireDAC.DApt.Intf, FireDAC.DApt, FireDAC.Comp.DataSet, FireDAC.VCLUI.Wait,
  FireDAC.Phys.FB, FireDAC.Phys.FBDef, FireDAC.Phys.PG, FireDAC.Phys.PGDef;

type
  TDmGeneric = class(TDataModule)
    FDConnection: TFDConnection;
    FDTransaction: TFDTransaction;
    FDQuery: TFDQuery;
    FDPhysPgDriverLink1: TFDPhysPgDriverLink;
  protected
    procedure VerifyTable(Name: string);
    procedure VerifyColumnInTable(Table, Column, FieldType: string);
  private
    { Private declarations }
  public
    { Public declarations }
    constructor Create;
  end;

var
  DmGeneric: TDmGeneric;

implementation

{%CLASSGROUP 'System.Classes.TPersistent'}

{$R *.dfm}

{ TDmGeneric }

constructor TDmGeneric.Create;
begin
  inherited Create(nil);
end;

procedure TDmGeneric.VerifyColumnInTable(Table, Column, FieldType: string);
begin

end;

procedure TDmGeneric.VerifyTable(Name: string);
begin

end;

end.
