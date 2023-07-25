<template>
  <q-page class="">
    <div v-if="personagens.length < 1" class="text-center q-pa-lg">
      <h4>Lista de Personagens</h4>
    </div>
    <!-- eslint-disable-next-line max-len -->
    <q-btn v-if="personagens.length < 1" class="q-ma-lg" color="primary" icon-right="send" label="Carregar Personagens" @click="loadPersonagens()" q-pa-lg />

    <p v-if="personagens.length > 0" class="text-center q-ma-lg">
      <strong>Clique no nome para carregar detalhes e imagem</strong>
    </p>

    <q-dialog v-model="imgPersonagemAberta">
      <q-card style="max-width: 500px; width:95%;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ personagem.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-img :src="personagem.image" :ratio="4 / 3" />
          <template v-if="personagem.favorite == true">
            <!-- eslint-disable-next-line max-len -->
            <q-btn icon="favorite" color="red" class="mt-20" @click="desfavoritar"></q-btn>
          </template>
          <template v-else>
            <q-btn icon="favorite" class="mt-20"
              @click="favoritar">
            </q-btn>
          </template> <br>
          <strong>Sexo:</strong> {{ getGender }} <br>
          <strong>Casa:</strong> {{ personagem.house }} <br>
          <strong>Ano de nascimento:</strong> {{ personagem.yearOfBirth }} <br>
          <strong>Estudante de Hogwarts:</strong> {{ getIsStudent }} <br>
          <template v-if="personagem.nickname">
            <strong>Apelido:</strong> {{ personagem.nickname }}
          </template> <br>
          <q-input outlined v-model="nickname" label="Digite um apelido" counter maxlength="30">
            <template v-slot:append>
              <q-btn round dense flat icon="add" @click="addNickname"></q-btn>
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-list class="bg-white" v-if="personagensSelecionado" separator bordered>
      <!-- eslint-disable-next-line max-len -->
      <q-input v-model="filter" label="Pesquisar" v-if="personagens.length > 0" color="black" bg-color="indigo-2" />
      <!-- eslint-disable-next-line max-len -->
      <q-item v-for="(p, index) in personagensSelecionado" :key="index" clickable v-ripple
        @click="personagem = p; imgPersonagemAberta = true">
        <q-item-section>
          <q-item-label>{{ p.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>
<script>
import useSupabase from 'boot/supabase';

const { supabase } = useSupabase();

export default {
  data() {
    return {
      personagem: undefined,
      filter: '',
      personagens: [],
      nickname: '',
      loading: false,
      imgPersonagemAberta: false,
    };
  },
  methods: {
    async loadPersonagens() {
      this.loading = true;
      const url = 'https://hp-api.onrender.com/api/characters';
      fetch(url)
        .then((data) => (data.json()))
        .then((response) => {
          this.personagens = response.map((p) => ({ favorite: false, nickname: '', ...p }));
          this.loading = false;
        })
        .then(() => {
          this.personagens.forEach(async (p) => {
            const { data, error } = await supabase
              .from('characters')
              .select('*')
              .eq('name', p.name);

            if (error) {
              console.log('Personagem não encontrado:', error);
            } else if (data.length !== 0) {
              p.favorite = data[0].favorite;
              p.nickname = data[0].nickname;
              console.log('Personagem encontrado:', data);
            } else {
              const newCharacter = { name: p.name, favorite: false, nickname: '' };
              await supabase.from('characters').insert([newCharacter]);
              console.log('Personagem não encontrado:', error);
            }
          });
        });
    },
    async favoritar() {
      this.personagem.favorite = true;
      const updatedFavorite = { favorite: true };
      const { data, error } = await supabase.from('characters').update([updatedFavorite]).eq('name', this.personagem.name);

      if (error) {
        console.error('Erro ao salvar o favorito:', error.message);
      } else {
        console.log('Favorito salvo com sucesso:', data);
      }
    },
    async desfavoritar() {
      this.personagem.favorite = false;
      const updatedFavorite = { favorite: false };
      const { data, error } = await supabase.from('characters').update([updatedFavorite]).eq('name', this.personagem.name);

      if (error) {
        console.error('Erro ao remover favorito:', error.message);
      } else {
        console.log('Favorito removido com sucesso:', data);
      }
    },
    async addNickname() {
      this.personagem.nickname = this.nickname;
      this.nickname = '';
      const updatedFavorite = { nickname: this.personagem.nickname };
      const { data, error } = await supabase.from('characters').update([updatedFavorite]).eq('name', this.personagem.name);

      if (error) {
        console.error('Erro ao salvar nickname:', error.message);
      } else {
        console.log('Nickname salvo com sucesso:', data);
      }
    },
  },
  computed: {
    personagensSelecionado() {
      return this.personagens.filter((e) => (e.name.match(this.filter)));
    },
    getGender() {
      if (this.personagem) {
        if (this.personagem.gender === 'male') { return 'Masculino'; }
        return 'Feminino';
      }
      return '';
    },
    getIsStudent() {
      if (this.personagem) {
        if (this.personagem.hogwartsStudent === true) { return 'Positivo'; }
        return 'Negativo';
      }
      return '';
    },
  },
};
</script>
