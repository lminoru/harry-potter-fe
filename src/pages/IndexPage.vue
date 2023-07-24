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
          <strong>Sexo:</strong> {{ personagem.gender }} <br>
          <strong>Casa:</strong> {{ personagem.house }} <br>
          <strong>Ano de nascimento:</strong> {{ personagem.yearOfBirth }} <br>
          <strong>Estudante de Hogwarts:</strong> {{ personagem.hogwartsStudent }} <br>
          <template v-if="personagem.favorite == true">
            <!-- eslint-disable-next-line max-len -->
            <q-btn icon="favorite" color="red" class="mt-20" @click="desfavoritar"></q-btn>
          </template>
          <template v-else>
            <q-btn icon="favorite" class="mt-20"
              @click="favoritar">
            </q-btn>
          </template>

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
          this.personagens = response.map((p) => ({ favorite: false, ...p }));
          this.loading = false;
        })
        .then(() => {
          this.personagens.forEach(async (p) => {
            const { data, error } = await supabase
              .from('favoritos')
              .select('favorite')
              .eq('name', p.name);

            if (error) {
              console.log('Favorito n encontrado:', error);
            } else if (data.length !== 0) {
              p.favorite = data[0].favorite;
              console.log('Favorito encontrado:', data);
            } else {
              const newFavorite = { name: p.name, favorite: false };
              await supabase.from('favoritos').insert([newFavorite]);
              console.log('Favorito n encontrado:', error);
            }
          });
        });
    },
    async favoritar() {
      console.log(this.$supabase);
      this.personagem.favorite = true;
      const newFavorite = { name: this.personagem.name, favorite: true };
      const { data, error } = await supabase.from('favoritos').insert([newFavorite]);

      if (error) {
        console.error('Erro ao inserir o favorito:', error.message);
      } else {
        console.log('Usuário inserido com sucesso:', data);
      }
    },
    async desfavoritar() {
      this.personagem.favorite = false;
      const newFavorite = { name: this.personagem.name, favorite: false };
      const { data, error } = await supabase.from('favoritos').insert([newFavorite]);

      if (error) {
        console.error('Erro ao remover o favorito:', error.message);
      } else {
        console.log('Usuário inserido com sucesso:', data);
      }
    },
  },
  computed: {
    personagensSelecionado() {
      return this.personagens.filter((e) => (e.name.match(this.filter)));
    },
  },
};
</script>
