unit Cosmetika.Controller.PurchaseInvoice;

interface

uses
  Horse;

type
  TControllerPurchaseInvoice = class
  private
    class procedure DoShow(Req: THorseRequest; Res: THorseResponse);
    class procedure DoStore(Req: THorseRequest; Res: THorseResponse);
  public
    class procedure Registry;
  end;

implementation

uses
  Cosmetika.Dao.PurchaseInvoice, System.JSON;

{ TControllerPurchaseInvoice }

class procedure TControllerPurchaseInvoice.DoShow(Req: THorseRequest;
  Res: THorseResponse);
var
  InvoiceDao: TDmPurchaseInvoice;
  JsonObj: TJSONObject;
begin
  InvoiceDao := TDmPurchaseInvoice.Create;
  try
    JsonObj := InvoiceDao.Show(Req.Params.Dictionary);

    if Assigned(JsonObj) then
      Res.Send<TJSONObject>(JsonObj).Status(THTTPStatus.OK)
    else
      Res.Status(THTTPStatus.NoContent);
  finally
    InvoiceDao.Free;
  end;
end;

class procedure TControllerPurchaseInvoice.DoStore(Req: THorseRequest;
  Res: THorseResponse);
var
  InvoiceDao: TDmPurchaseInvoice;
begin
  InvoiceDao := TDmPurchaseInvoice.Create;
  try
    if InvoiceDao.Store(Req.Body<TJSONObject>) then
      Res.Status(THTTPStatus.Created)
    else
      Res.Status(THTTPStatus.BadRequest);
  finally
    InvoiceDao.Free;
  end;
end;

class procedure TControllerPurchaseInvoice.Registry;
begin
  THorse.Get('purchase-invoices/:id', DoShow);
  THorse.Post('purchase-invoices', DoStore);
end;

end.
