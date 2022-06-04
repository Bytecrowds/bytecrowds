package models

type Bytecrowd struct {
	Room string
	Data struct {
		BytecrowdText struct {
			Type    string
			Content string
		}
	}
}

type StoredBytecrowd struct {
	Name string
	Text string
}
