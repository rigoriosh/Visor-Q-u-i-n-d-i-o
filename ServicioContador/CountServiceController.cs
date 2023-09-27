using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace VISORSIGQUINDIO.ServicioContador
{
    public class CountServiceController : ApiController
    {

        LogicaConador logicaContador = new LogicaConador();

        [Route("s/c/v/total")]
        public string Get()
        {
            return logicaContador.TotalCountVisitor();
        }

        [Route("s/c/v/add")]
        public void Post(JObject verificacion)
        {
            logicaContador.CountNewVisitor(verificacion);
        }


    }
}
