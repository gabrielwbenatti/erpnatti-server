unit Cosmetika.Controller.Product;

interface

uses
  Horse;

type
  TControllerProduct = class
  private
    class procedure DoDestroy(Req: THorseRequest; Res: THorseResponse);
    class procedure DoIndex(Req: THorseRequest; Res: THorseResponse);
    class procedure DoShow(Req: THorseRequest; Res: THorseResponse);
    class procedure DoStore(Req: THorseRequest; Res: THorseResponse);
  public
    class procedure Registry;
  end;

implementation

uses
  Cosmetika.Dao.Product, Cosmetika.Model.Product, System.JSON, System.SysUtils;

{ TControllerProduct }

class procedure TControllerProduct.DoDestroy(Req: THorseRequest;
  Res: THorseResponse);
var
  ProductDao: TDmProduct;
begin
  ProductDao := TDmProduct.Create;
  try
    if ProductDao.Destroy(Req.Params.Dictionary) then
      Res.Status(THTTPStatus.OK)
    else
      Res.Status(THTTPStatus.BadRequest);
  finally
    ProductDao.Free;
  end;
end;

class procedure TControllerProduct.DoIndex(Req: THorseRequest;
  Res: THorseResponse);
var
  ProductDao: TDmProduct;
  JsonArray: TJSONArray;
begin
  ProductDao := TDmProduct.Create;
  try
    try
      JsonArray := ProductDao.Index(Req.Query.Dictionary);
      Res.Send<TJSONArray>(JsonArray);
    except
      on E: Exception do
        Res.Send(E.Message)
    end;
  finally
    ProductDao.Free;
  end;
end;

class procedure TControllerProduct.DoShow(Req: THorseRequest;
  Res: THorseResponse);
var
  ProductDao: TDmProduct;
  JsonObj: TJSONObject;
begin
  ProductDao := TDmProduct.Create;
  try
    JsonObj := ProductDao.Show(Req.Params.Dictionary);
    if Assigned(JsonObj) then
      Res.Send(JsonObj).Status(THTTPStatus.OK)
    else
      Res.Status(THTTPStatus.NoContent);
  finally
    ProductDao.Free;
  end;
end;

class procedure TControllerProduct.DoStore(Req: THorseRequest;
  Res: THorseResponse);
var
  ProductDao: TDmProduct;
begin
  ProductDao := TDmProduct.Create;
  try
    if ProductDao.Store(Req.Body<TJSONObject>) then
      Res.Status(201)
    else
      Res.Status(400);
  finally
    ProductDao.Free;
  end;
end;

class procedure TControllerProduct.Registry;
begin
  THorse.Get('/products', DoIndex);
  THorse.Post('/products', DoStore);
  THorse.Get('/products/:id', DoShow);
  THorse.Delete('/products/:id', DoDestroy);
end;

end.
