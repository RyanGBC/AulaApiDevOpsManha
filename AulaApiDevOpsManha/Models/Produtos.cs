namespace AulaApiDevOpsManha.Models
{
    public class Produtos : Base
    {
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public int Quantidade { get; set; }
        public decimal Valor { get; set; }
    }
}
