using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Xml;


namespace VISORSIGQUINDIO.ServicioContador
{
    public class LogicaConador
    {

        private XmlDocument docDatos;
        private string pathApp;

        public LogicaConador()
        {
            pathApp = Path.Combine(Path.GetDirectoryName(System.AppDomain.CurrentDomain.BaseDirectory), @"ServicioContador\InfoContador.xml");
            docDatos = new XmlDocument();
            docDatos.Load(pathApp);
            
        }

        private int ReaderTagXML()
        {
            XmlNodeList nodo = docDatos.GetElementsByTagName("visitas");
            int numberVisit = int.Parse(nodo[0].InnerText);
            return numberVisit;
        }

        public string TotalCountVisitor()
        {
            char quote = '"';
            string total = "{"+ quote +  "totalVisitas" + quote + ":" + ReaderTagXML().ToString() + "}";


            return total; 
        }

        public void CountNewVisitor(JObject verificacion)
        {

            DateTime now = DateTime.Now;
            now = now.AddDays(1);
            string fecha = now.ToShortDateString();
            string hash = GetMD5(fecha);

            if (hash == verificacion["verificacion"].ToString()) {

                int visit = ReaderTagXML();
                ModifyVisit(visit);
            }
   
        }

        public void ModifyVisit(int visit)
        {
            XmlNodeList nodo = docDatos.GetElementsByTagName("visitas");
            nodo[0].InnerText = Convert.ToString(visit + 1);
            SaveXML();
        }

        private void SaveXML() { docDatos.Save(pathApp); }

        public static string GetMD5(string str)
        {
            MD5 md5 = MD5CryptoServiceProvider.Create();
            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] stream = null;
            StringBuilder sb = new StringBuilder();
            stream = md5.ComputeHash(encoding.GetBytes(str));
            for (int i = 0; i < stream.Length; i++) sb.AppendFormat("{0:x2}", stream[i]);
            return sb.ToString();
        }
    }
}