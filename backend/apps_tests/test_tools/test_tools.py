from django.test import SimpleTestCase
from tools.localisation import Localisation

class TestTools(SimpleTestCase):
    """Localisation test class
    """

    def test_loading_existing_yaml_file_is_ok(self):
        """Loading an exising yaml should be ok
        """
        # Given
        language = "fr"

        # Acts
        locale = Localisation(language=language)

        # Assert
        self.assertEqual(type(locale.locale_dict),dict)
        self.assertEqual(locale.locale_dict['DATA_APP_NAME'],"Données")

    def test_loading_unkown_locale_file_should_generates_exception(self):
        """When the locale file is unknown a FileNotFound Exception
        should be raised
        """
        # Given
        language = "kjlmkmk"

        # Acts & Assert
        try:
            Localisation(language=language)
            assert False
        except FileNotFoundError:
            assert True

    def test_load_localised_text_with_correct_id_should_returns_text(self):
        """When the users specifies an exisiting id within an existing language,
        the text should be returned
        """
        # Given
        language = "en-us"
        text_id = "DATA_APP_NAME"

        # Acts
        locale = Localisation(language=language)
        text_value = locale.load_localised_text(text_id=text_id)

        # Asserts
        self.assertEqual(text_value,"Data")
