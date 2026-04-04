export const PT_BR_STOP_WORDS: ReadonlySet<string> = new Set([
	// Articles
	"o", "a", "os", "as", "um", "uma", "uns", "umas",

	// Prepositions
	"de", "em", "com", "por", "para", "sem", "sob", "sobre", "entre",
	"ate", "até", "contra", "desde", "perante", "segundo",
	"tras", "após", "apos", "mediante",

	// Contractions (preposition + article)
	"do", "da", "dos", "das",
	"no", "na", "nos", "nas",
	"ao", "aos",
	"pelo", "pela", "pelos", "pelas",
	"num", "numa", "nuns", "numas",
	"dele", "dela", "deles", "delas",
	"nele", "nela", "neles", "nelas",
	"deste", "desta", "destes", "destas",
	"neste", "nesta", "nestes", "nestas",
	"desse", "dessa", "desses", "dessas",
	"nesse", "nessa", "nesses", "nessas",
	"daquele", "daquela", "daqueles", "daquelas",
	"naquele", "naquela", "naqueles", "naquelas",
	"disto", "disso", "daquilo",
	"nisto", "nisso", "naquilo",

	// Personal pronouns
	"eu", "tu", "ele", "ela", "nos", "vos", "eles", "elas",
	"voce", "voces", "você", "vocês",

	// Oblique pronouns ("se" excluded — classified as conjunction in lexicon)
	"me", "te", "lhe", "lhes",
	"mim", "ti", "si",
	"comigo", "contigo", "consigo", "conosco", "convosco",

	// Demonstrative pronouns
	"este", "esta", "estes", "estas",
	"esse", "essa", "esses", "essas",
	"aquele", "aquela", "aqueles", "aquelas",
	"isto", "isso", "aquilo",

	// Possessive pronouns
	"meu", "minha", "meus", "minhas",
	"teu", "tua", "teus", "tuas",
	"seu", "sua", "seus", "suas",
	"nosso", "nossa", "nossos", "nossas",
	"vosso", "vossa", "vossos", "vossas",

	// Relative pronouns
	"qual", "quais", "cujo", "cuja", "cujos", "cujas",
	"quem", "onde",

	// Interrogative pronouns ("quanto" excluded — classified as conjunction in lexicon)
	"quanta", "quantos", "quantas",

	// Common function words
	"nao", "não", "mais", "muito", "ja", "já", "tambem", "também",
	"so", "só", "como",
	"ainda", "mesmo", "bem", "aqui", "ali", "la", "lá", "ca", "cá",
	"tudo", "nada", "algo", "alguem", "alguém", "ninguem", "ninguém",
	"cada", "todo", "toda", "todos", "todas",
	"outro", "outra", "outros", "outras",
]);
